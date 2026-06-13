import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mandarin_pathways/main.dart';

void main() {
  testWidgets('App builds MaterialApp shell', (WidgetTester tester) async {
    await tester.pumpWidget(const MandarinPathwaysApp());
    await tester.pump();

    expect(find.byType(MaterialApp), findsOneWidget);
  });
}
