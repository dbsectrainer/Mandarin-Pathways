import gzip
import os
import socketserver
from http import HTTPStatus

import http.server

# Paths that compress well via gzip (stay aligned with handlers below).
_GZIP_EXTENSIONS = ('.html', '.css', '.js', '.txt', '.json')


class GzipHandler(http.server.SimpleHTTPRequestHandler):
    """
    SimpleHTTPRequestHandler with gzip for text-heavy static files only.

    The previous implementation compressed inside end_headers() after stock send_head()
    had already emitted Content-Length, producing illegal duplicate headers while
    stock do_GET still streamed the uncompressed file. Compression is isolated to
    do_GET/do_HEAD with a single header set + one write.
    """

    def send_response_only(self, code, message=None):
        super().send_response_only(code, message)

        tail = self._url_path_without_query()

        if tail.endswith(
            ('.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg')
        ):
            self.send_header('Cache-Control', 'public, max-age=31536000')
        elif tail.endswith(('.html', '.json')):
            self.send_header('Cache-Control', 'public, max-age=0, must-revalidate')

        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')

    @staticmethod
    def _accepts_gzip(value):
        if not value:
            return False
        return 'gzip' in value.lower()

    def _url_path_without_query(self):
        return self.path.split('?', 1)[0].split('#', 1)[0]

    def _should_try_gzip(self):
        if not self._accepts_gzip(self.headers.get('Accept-Encoding')):
            return False
        tail = self._url_path_without_query().lower()
        return tail.endswith(_GZIP_EXTENSIONS)

    def _defer_to_parent_headers(self):
        """Let stock handler manage Range requests and validators."""
        if self.headers.get('Range'):
            return True
        if self.headers.get('If-Modified-Since'):
            return True
        if self.headers.get('If-None-Match'):
            return True
        return False

    def _emit_gzip(self, fs_path, write_body=True):
        with open(fs_path, 'rb') as fh:
            raw = fh.read()
        encoded = gzip.compress(raw)
        st = os.stat(fs_path)

        self.send_response(HTTPStatus.OK)
        ctype = self.guess_type(fs_path)
        if ctype:
            self.send_header('Content-Type', ctype)
        self.send_header('Last-Modified', self.date_time_string(st.st_mtime))
        self.send_header('Content-Encoding', 'gzip')
        self.send_header('Content-Length', str(len(encoded)))
        self.send_header('Vary', 'Accept-Encoding')
        self.end_headers()
        if write_body:
            try:
                self.wfile.write(encoded)
            except BrokenPipeError:
                pass
            except ConnectionResetError:
                pass

    def do_GET(self):
        if self._defer_to_parent_headers():
            super().do_GET()
            return

        if self._should_try_gzip():
            fs_path = self.translate_path(self.path)
            if os.path.isfile(fs_path):
                try:
                    self._emit_gzip(fs_path, write_body=True)
                except OSError:
                    self.send_error(HTTPStatus.NOT_FOUND.value, 'File not found')
                return

        super().do_GET()

    def do_HEAD(self):
        if self._defer_to_parent_headers():
            super().do_HEAD()
            return

        if self._should_try_gzip():
            fs_path = self.translate_path(self.path)
            if os.path.isfile(fs_path):
                try:
                    self._emit_gzip(fs_path, write_body=False)
                except OSError:
                    self.send_error(HTTPStatus.NOT_FOUND.value, 'File not found')
                return

        super().do_HEAD()


if __name__ == '__main__':
    PORT = 8000
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(('', PORT), GzipHandler) as httpd:
        print(f'Serving at port {PORT} with Gzip compression and caching enabled')
        httpd.serve_forever()
