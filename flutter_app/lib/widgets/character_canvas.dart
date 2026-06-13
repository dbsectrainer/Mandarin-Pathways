import 'package:flutter/material.dart';

class CharacterCanvas extends StatefulWidget {
  const CharacterCanvas({super.key});

  @override
  State<CharacterCanvas> createState() => _CharacterCanvasState();
}

class _CharacterCanvasState extends State<CharacterCanvas> {
  final List<Offset> _points = [];
  bool _isDrawing = false;

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const Text('Character Practice',
                style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Container(
              width: 200,
              height: 200,
              decoration: BoxDecoration(
                border: Border.all(color: Colors.grey),
                color: const Color(0xFFF8F8F8),
              ),
              child: GestureDetector(
                onPanStart: (d) {
                  setState(() {
                    _isDrawing = true;
                    _points.add(d.localPosition);
                  });
                },
                onPanUpdate: (d) {
                  if (_isDrawing) {
                    setState(() => _points.add(d.localPosition));
                  }
                },
                onPanEnd: (_) => setState(() => _isDrawing = false),
                child: CustomPaint(
                  painter: _DrawingPainter(_points),
                  size: const Size(200, 200),
                ),
              ),
            ),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                TextButton(
                  onPressed: () => setState(() => _points.clear()),
                  child: const Text('Clear'),
                ),
                const Text(' | '),
                const Text('你 好 我 是', style: TextStyle(fontSize: 24)),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

class _DrawingPainter extends CustomPainter {
  final List<Offset> points;
  _DrawingPainter(this.points);

  @override
  void paint(Canvas canvas, Size size) {
    final grid = Paint()
      ..color = const Color(0xFFE0E0E0)
      ..strokeWidth = 1;
    canvas.drawLine(Offset(size.width / 2, 0),
        Offset(size.width / 2, size.height), grid);
    canvas.drawLine(Offset(0, size.height / 2),
        Offset(size.width, size.height / 2), grid);

    final stroke = Paint()
      ..color = const Color(0xFF333333)
      ..strokeWidth = 3
      ..strokeCap = StrokeCap.round;

    for (var i = 0; i < points.length - 1; i++) {
      canvas.drawLine(points[i], points[i + 1], stroke);
    }
  }

  @override
  bool shouldRepaint(covariant _DrawingPainter old) =>
      old.points.length != points.length;
}
