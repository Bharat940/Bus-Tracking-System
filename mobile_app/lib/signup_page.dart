import 'package:flutter/material.dart';
import 'package:mobile_app/auth_service.dart'; 
import 'package:mobile_app/driver_page.dart';
import 'package:mobile_app/signin_page.dart';

class Signup extends StatefulWidget {
  const Signup({super.key});

  @override
  State<Signup> createState() => _SignupState();
}

class _SignupState extends State<Signup> {
  final _formKey = GlobalKey<FormState>();

  // Controllers
  final TextEditingController nameController = TextEditingController();
  final TextEditingController phoneController = TextEditingController();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  String? selectedRole; 
  bool _obscurePassword = true; 
  final AuthService _authService = AuthService();

  bool _isLoading = false;

  Future<void> _handleSignup() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final result = await _authService.signup(
        name: nameController.text,
        phone: phoneController.text,
        email: emailController.text,
        password: passwordController.text,
        role: selectedRole!,
      );

      debugPrint("✅ Signup Success: $result");

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("Signup successful!")),
      );

      // ✅ If role is driver → navigate to DriverPage
      if (selectedRole == "driver") {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const MapPage()),
        );
      } else {
        // If commuter → go to login page (or some other page)
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (context) => const SignIn()),
        );
      }
    } catch (e) {
      debugPrint("❌ Signup Error: $e");
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Signup failed: $e")),
      );
    } finally {
      if (mounted) {
        setState(() => _isLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;

    return Scaffold(
      backgroundColor: const Color(0xFFFFFFFF),
      body: Center(
        child: SingleChildScrollView(
          padding: EdgeInsets.symmetric(
            horizontal: screenWidth * 0.08,
            vertical: screenHeight * 0.02,
          ),
          child: Form(
            key: _formKey,
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Image.asset(
                  "assets/bus_logo.png",
                  width: screenWidth * 0.40,
                  height: screenWidth * 0.40,
                  fit: BoxFit.contain,
                ),
                SizedBox(height: screenHeight * 0.02),

                const Text(
                  "Register",
                  style: TextStyle(
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                    color: Color.fromARGB(255, 16, 10, 46),
                  ),
                ),
                SizedBox(height: screenHeight * 0.04),

                // Name
                TextFormField(
                  controller: nameController,
                  decoration: _inputDecoration(context, "Full Name"),
                  validator: (v) =>
                      v == null || v.isEmpty ? "Enter your name" : null,
                ),
                SizedBox(height: screenHeight * 0.025),

                // Phone
                TextFormField(
                  controller: phoneController,
                  keyboardType: TextInputType.phone,
                  decoration: _inputDecoration(context, "Phone Number"),
                  validator: (v) {
                    if (v == null || v.isEmpty) return "Enter your phone number";
                    if (v.length < 10) return "Phone number must be at least 10 digits";
                    return null;
                  },
                ),
                SizedBox(height: screenHeight * 0.025),

                // Email
                TextFormField(
                  controller: emailController,
                  decoration: _inputDecoration(context, "Email"),
                  validator: (v) {
                    if (v == null || v.isEmpty) return "Enter your email";
                    if (!RegExp(r'^[\w\.-]+@[\w\.-]+\.\w+$').hasMatch(v)) {
                      return "Enter a valid email";
                    }
                    return null;
                  },
                ),
                SizedBox(height: screenHeight * 0.025),

                // Password
                TextFormField(
                  controller: passwordController,
                  obscureText: _obscurePassword,
                  decoration: _inputDecoration(context, "Password").copyWith(
                    suffixIcon: IconButton(
                      icon: Icon(
                        _obscurePassword
                            ? Icons.visibility_off
                            : Icons.visibility,
                        color: Theme.of(context).primaryColor,
                      ),
                      onPressed: () =>
                          setState(() => _obscurePassword = !_obscurePassword),
                    ),
                  ),
                  validator: (v) {
                    if (v == null || v.isEmpty) return "Enter your password";
                    if (v.length < 7) return "Password must be at least 7 characters";
                    return null;
                  },
                ),
                SizedBox(height: screenHeight * 0.025),

                // Role
                DropdownButtonFormField<String>(
                  decoration: _inputDecoration(context, "Select Role"),
                  value: selectedRole,
                  items: const [
                    DropdownMenuItem(value: "driver", child: Text("Driver")),
                    DropdownMenuItem(value: "commuter", child: Text("Commuter")),
                  ],
                  onChanged: (val) => setState(() => selectedRole = val),
                  validator: (v) => v == null ? "Please select a role" : null,
                ),
                SizedBox(height: screenHeight * 0.028),

                // Button
                SizedBox(
                  width: double.infinity,
                  height: screenHeight * 0.06,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).primaryColor,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                    onPressed: _isLoading ? null : _handleSignup,
                    child: _isLoading
                        ? const CircularProgressIndicator(color: Colors.white)
                        : const Text(
                            "SIGN UP",
                            style: TextStyle(
                              fontWeight: FontWeight.bold,
                              fontSize: 16,
                              color: Colors.white,
                            ),
                          ),
                  ),
                ),
                SizedBox(height: screenHeight * 0.03),

                // Already have account
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    const Text("Already have an account? ",
                        style: TextStyle(fontSize: 17)),
                    GestureDetector(
                      onTap: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(builder: (context) => const SignIn()),
                        );
                      },
                      child: const Text(
                        "Sign in here",
                        style: TextStyle(
                          color: Colors.blue,
                          fontWeight: FontWeight.bold,
                          fontSize: 17,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  InputDecoration _inputDecoration(BuildContext context, String hint) {
    return InputDecoration(
      hintText: hint,
      contentPadding: const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
      enabledBorder: OutlineInputBorder(
        borderSide: BorderSide(color: Theme.of(context).primaryColor, width: 2.5),
        borderRadius: BorderRadius.circular(12),
      ),
      focusedBorder: OutlineInputBorder(
        borderSide: BorderSide(color: Theme.of(context).primaryColor, width: 2.5),
        borderRadius: BorderRadius.circular(12),
      ),
      errorBorder: OutlineInputBorder(
        borderSide: const BorderSide(color: Colors.red, width: 2.5),
        borderRadius: BorderRadius.circular(12),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderSide: const BorderSide(color: Colors.red, width: 2.5),
        borderRadius: BorderRadius.circular(12),
      ),
    );
  }
}




