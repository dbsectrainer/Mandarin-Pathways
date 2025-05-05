import http.server
import socketserver
import gzip
import os
from datetime import datetime, timedelta

class GzipHandler(http.server.SimpleHTTPRequestHandler):
    def send_response_only(self, code, message=None):
        super().send_response_only(code, message)
        
        # Add cache headers for static assets
        if self.path.endswith(('.css', '.js', '.png', '.jpg', '.jpeg', '.gif', '.ico', '.svg')):
            self.send_header('Cache-Control', 'public, max-age=31536000')  # 1 year
        elif self.path.endswith(('.html', '.json')):
            self.send_header('Cache-Control', 'public, max-age=0, must-revalidate')
        
        # Add CORS headers
        self.send_header('Access-Control-Allow-Origin', '*')
        
        # Add security headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')
        
    def end_headers(self):
        accept_encoding = self.headers.get('Accept-Encoding', '')
        
        # Check if client accepts gzip
        if 'gzip' in accept_encoding and self.path.endswith(('.html', '.css', '.js', '.txt', '.json')):
            path = self.translate_path(self.path)
            if os.path.exists(path):
                with open(path, 'rb') as f:
                    content = f.read()
                    
                # Compress content
                gzip_content = gzip.compress(content)
                self.send_header('Content-Encoding', 'gzip')
                self.send_header('Content-Length', str(len(gzip_content)))
                self.send_header('Vary', 'Accept-Encoding')
                super().end_headers()
                self.wfile.write(gzip_content)
                return
                
        super().end_headers()

if __name__ == '__main__':
    PORT = 8000
    Handler = GzipHandler
    
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Serving at port {PORT} with Gzip compression and caching enabled")
        httpd.serve_forever()
