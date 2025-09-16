import 'package:flutter/material.dart';
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

  @override
  Widget build(BuildContext context) {
    final screenWidth = MediaQuery.of(context).size.width;
    final screenHeight = MediaQuery.of(context).size.height;

    return Scaffold(
      body: Stack(
        children: [
          
          SizedBox.expand(
            child: Image.asset(
              "assets/bg_bus.png",
              fit: BoxFit.fill,
            ),
          ),

          
          Container(
            color: Colors.black.withOpacity(0.3),
          ),

        
          Center(
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
                        color: Colors.white,
                      ),
                    ),
                    SizedBox(height: screenHeight * 0.04),

                    // Name Field
                    TextFormField(
                      controller: nameController,
                      style: const TextStyle(color: Colors.white), 
                      decoration: _inputDecoration(context, "Full Name"),
                      validator: (value) =>
                          value == null || value.isEmpty
                              ? "Enter your name"
                              : null,
                    ),
                    SizedBox(height: screenHeight * 0.025),

                    // Phone Number Field
                    TextFormField(
                      controller: phoneController,
                      style: const TextStyle(color: Colors.white),
                      keyboardType: TextInputType.phone,
                      decoration: _inputDecoration(context, "Phone Number"),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return "Enter your phone number";
                        } else if (value.length < 10) {
                          return "Phone number must be at least 10 digits";
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: screenHeight * 0.025),

                    // Email Field
                    TextFormField(
                      controller: emailController,
                      style: const TextStyle(color: Colors.white),
                      decoration: _inputDecoration(context, "Email"),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return "Enter your email";
                        } else if (!RegExp(r'^[\w\.-]+@[\w\.-]+\.\w+$')
                            .hasMatch(value)) {
                          return "Enter a valid email";
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: screenHeight * 0.025),

                    // Password Field
                    TextFormField(
                      controller: passwordController,
                      style: const TextStyle(color: Colors.white),
                      obscureText: _obscurePassword,
                      decoration: _inputDecoration(
                        context,
                        "Password",
                        suffix: IconButton(
                          icon: Icon(
                            _obscurePassword
                                ? Icons.visibility_off
                                : Icons.visibility,
                            color: Colors.white,
                          ),
                          onPressed: () {
                            setState(() {
                              _obscurePassword = !_obscurePassword;
                            });
                          },
                        ),
                      ),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return "Enter your password";
                        } else if (value.length < 7) {
                          return "Password must be at least 7 characters";
                        }
                        return null;
                      },
                    ),
                    SizedBox(height: screenHeight * 0.025),

                    // Role Dropdown
                    DropdownButtonFormField<String>(
                      decoration: _inputDecoration(context, "Select Role"),
                      hint: const Text(
                        "Select Role",
                        style: TextStyle(color: Colors.white70),
                      ),
                      dropdownColor: Colors.black,
                      value: selectedRole,
                      items: const [
                        DropdownMenuItem(
                          value: "Driver",
                          child: Text(
                            "Driver",
                            style: TextStyle(color: Colors.white),
                          ),
                        ),
                        DropdownMenuItem(
                          value: "Commuter",
                          child: Text(
                            "Commuter",
                            style: TextStyle(color: Colors.white),
                          ),
                        ),
                      ],
                      onChanged: (value) {
                        setState(() {
                          selectedRole = value;
                        });
                      },
                      style: const TextStyle(color: Colors.white),
                    ),
                    SizedBox(height: screenHeight * 0.028),

                    // Sign Up Button
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
                        onPressed: () {
                          if (_formKey.currentState!.validate()) {
                            debugPrint(
                                "✅ Name: ${nameController.text}, Phone: ${phoneController.text}, Email: ${emailController.text}, Password: ${passwordController.text}, Role: $selectedRole");
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                  content:
                                      Text("Form submitted successfully!")),
                            );
                          }
                        },
                        child: const Text(
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
                            style:
                                TextStyle(fontSize: 17, color: Colors.white)),
                        GestureDetector(
                          onTap: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => const SignIn()),
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
        ],
      ),
    );
  }

  // 🔹 Reusable Input Decoration
  InputDecoration _inputDecoration(BuildContext context, String hint,
      {Widget? suffix}) {
    return InputDecoration(
      hintText: hint,
      hintStyle: const TextStyle(color: Colors.white70),
      suffixIcon: suffix,
      filled: true,
      fillColor: Colors.white.withOpacity(0.2),
      contentPadding:
          const EdgeInsets.symmetric(vertical: 14, horizontal: 20),
      enabledBorder: OutlineInputBorder(
        borderSide:
            BorderSide(color: Theme.of(context).primaryColor, width: 2.5),
        borderRadius: BorderRadius.circular(12),
      ),
      focusedBorder: OutlineInputBorder(
        borderSide: const BorderSide(color: Colors.blue, width: 2.5),
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

