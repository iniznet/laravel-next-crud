import 'package:flutter/material.dart';

class DashboardPage extends StatelessWidget {
  final String username; // Tambahkan parameter username

  const DashboardPage({Key? key, required this.username}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Dashboard'),
      ),
      endDrawer: Drawer(
        // Menentukan lebar drawer
        width: MediaQuery.of(context).size.width * 0.45, // Contoh: 75% dari lebar layar
        child: Column(
          children: <Widget>[
            DrawerHeader(
              decoration: BoxDecoration(
                color: Colors.blue,
              ),
              child: Row(
                children: [
                  Icon(
                    Icons.person,
                    color: Colors.white,
                    size: 48.0,
                  ),
                  SizedBox(width: 16.0),
                  Text(
                    username, // Menampilkan username
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 24,
                    ),
                  ),
                ],
              ),
            ),
            ListTile(
              title: Text('Jasa'),
              onTap: () {
                Navigator.pop(context); // Menutup drawer setelah dipilih
              },
            ),
            ListTile(
              title: Text('Nota Servis'),
              onTap: () {
                Navigator.pop(context); // Menutup drawer setelah dipilih
              },
            ),
            ListTile(
              title: Text('Pembayaran'),
              onTap: () {
                Navigator.pop(context); // Menutup drawer setelah dipilih
              },
            ),
            Spacer(), // Membuat ruang kosong di antara item menu dan tombol logout
            ListTile(
              leading: Icon(Icons.logout),
              title: Text('Logout'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pop(context);
                // Implementasi logout
              },
            ),
          ],
        ),
      ),
      body: const Center(
        child: Text(
          'Welcome to the Dashboard!',
          style: TextStyle(fontSize: 24),
        ),
      ),
    );
  }
}
