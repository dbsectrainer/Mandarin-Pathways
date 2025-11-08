import 'package:flutter/material.dart';
import 'package:iconsax/iconsax.dart';
import '../config/theme_config.dart';
import 'home_screen.dart';
import 'statistics_screen.dart';
import 'achievements_screen.dart';
import 'profile_screen.dart';

class MainNavigation extends StatefulWidget {
  const MainNavigation({Key? key}) : super(key: key);

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _currentIndex = 0;

  final List<Widget> _screens = [
    const HomeScreen(),
    const StatisticsScreen(),
    const AchievementsScreen(),
    const ProfileScreen(),
  ];

  final List<NavigationItem> _navigationItems = [
    NavigationItem(
      icon: Iconsax.home,
      activeIcon: Iconsax.home_15,
      label: 'Home',
    ),
    NavigationItem(
      icon: Iconsax.chart,
      activeIcon: Iconsax.chart5,
      label: 'Stats',
    ),
    NavigationItem(
      icon: Iconsax.award,
      activeIcon: Iconsax.award5,
      label: 'Achievements',
    ),
    NavigationItem(
      icon: Iconsax.user,
      activeIcon: Iconsax.user5,
      label: 'Profile',
    ),
  ];

  void _onTabTapped(int index) {
    setState(() {
      _currentIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _currentIndex,
        children: _screens,
      ),
      bottomNavigationBar: Container(
        decoration: BoxDecoration(
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 10,
              offset: const Offset(0, -5),
            ),
          ],
        ),
        child: BottomNavigationBar(
          currentIndex: _currentIndex,
          onTap: _onTabTapped,
          type: BottomNavigationBarType.fixed,
          backgroundColor: Theme.of(context).colorScheme.surface,
          selectedItemColor: AppTheme.primaryRed,
          unselectedItemColor: AppTheme.lightTextSecondary,
          selectedFontSize: 12,
          unselectedFontSize: 11,
          elevation: 0,
          items: _navigationItems.map((item) {
            final isSelected = _navigationItems.indexOf(item) == _currentIndex;
            return BottomNavigationBarItem(
              icon: _buildNavIcon(
                isSelected ? item.activeIcon : item.icon,
                isSelected,
              ),
              label: item.label,
            );
          }).toList(),
        ),
      ),
    );
  }

  Widget _buildNavIcon(IconData icon, bool isSelected) {
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 16,
        vertical: 8,
      ),
      decoration: BoxDecoration(
        color: isSelected
            ? AppTheme.primaryRed.withOpacity(0.1)
            : Colors.transparent,
        borderRadius: BorderRadius.circular(AppTheme.radiusM),
      ),
      child: Icon(
        icon,
        size: 24,
      ),
    );
  }
}

class NavigationItem {
  final IconData icon;
  final IconData activeIcon;
  final String label;

  NavigationItem({
    required this.icon,
    required this.activeIcon,
    required this.label,
  });
}
