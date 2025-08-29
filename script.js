class AuthForm {
  constructor() {
    this.isLogin = true
    this.showPassword = false
    this.formData = {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    }

    this.initializeElements()
    this.bindEvents()
    this.updateUI()
    this.checkAuthStatus()
  }

  initializeElements() {
    this.form = document.getElementById("auth-form")
    this.cardTitle = document.getElementById("card-title")
    this.cardDescription = document.getElementById("card-description")
    this.nameGroup = document.getElementById("name-group")
    this.confirmPasswordGroup = document.getElementById("confirm-password-group")
    this.submitBtn = document.getElementById("submit-btn")
    this.forgotPassword = document.getElementById("forgot-password")
    this.toggleText = document.getElementById("toggle-text")
    this.modeToggleBtn = document.getElementById("mode-toggle-btn")
    this.passwordToggle = document.getElementById("password-toggle")
    this.passwordInput = document.getElementById("password")
    this.eyeIcon = document.getElementById("eye-icon")

    // Form inputs
    this.inputs = {
      name: document.getElementById("name"),
      email: document.getElementById("email"),
      password: document.getElementById("password"),
      confirmPassword: document.getElementById("confirm-password"),
    }
  }

  bindEvents() {
    this.form.addEventListener("submit", (e) => this.handleSubmit(e))
    this.modeToggleBtn.addEventListener("click", () => this.toggleMode())
    this.passwordToggle.addEventListener("click", () => this.togglePasswordVisibility())

    // Bind input change events
    Object.keys(this.inputs).forEach((key) => {
      this.inputs[key].addEventListener("input", (e) => this.handleInputChange(e))
    })
  }

  handleInputChange(e) {
    this.formData[e.target.name] = e.target.value
  }

  async handleSubmit(e) {
    e.preventDefault()

    // Disable submit button during request
    this.submitBtn.disabled = true
    this.submitBtn.textContent = this.isLogin ? "Signing in..." : "Creating account..."

    try {
      if (this.isLogin) {
        await this.login()
      } else {
        if (this.formData.password !== this.formData.confirmPassword) {
          this.showError("Passwords do not match!")
          return
        }
        await this.register()
      }
    } catch (error) {
      this.showError(error.message)
    } finally {
      // Re-enable submit button
      this.submitBtn.disabled = false
      this.updateUI()
    }
  }

  async login() {
    const response = await fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: this.formData.email,
        password: this.formData.password,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Login failed")
    }

    // Store token and user data
    localStorage.setItem("authToken", data.token)
    localStorage.setItem("userData", JSON.stringify(data.user))

    this.showSuccess(`Welcome back, ${data.user.name}!`)
    this.showDashboard(data.user)
  }

  async register() {
    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: this.formData.name,
        email: this.formData.email,
        password: this.formData.password,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || "Registration failed")
    }

    // Store token and user data
    localStorage.setItem("authToken", data.token)
    localStorage.setItem("userData", JSON.stringify(data.user))

    this.showSuccess(`Account created successfully! Welcome, ${data.user.name}!`)
    this.showDashboard(data.user)
  }

  checkAuthStatus() {
    const token = localStorage.getItem("authToken")
    const userData = localStorage.getItem("userData")

    if (token && userData) {
      try {
        const user = JSON.parse(userData)
        this.showDashboard(user)
      } catch (error) {
        // Invalid stored data, clear it
        localStorage.removeItem("authToken")
        localStorage.removeItem("userData")
      }
    }
  }

  showDashboard(user) {
    document.querySelector(".container").innerHTML = `
      <div class="auth-card">
        <div class="card-header">
          <h1>Welcome, ${user.name}!</h1>
          <p>You are successfully logged in</p>
        </div>
        <div class="card-content">
          <div class="user-info">
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>User ID:</strong> ${user.id}</p>
          </div>
          <div class="dashboard-actions">
            <button class="submit-btn" onclick="authForm.testProtectedEndpoint()">Test Protected Endpoint</button>
            <button class="submit-btn" onclick="authForm.logout()" style="background: #ef4444; margin-top: 10px;">Logout</button>
          </div>
          <div id="api-response" style="margin-top: 20px; padding: 15px; background: #f3f4f6; border-radius: 8px; display: none;">
            <h3>API Response:</h3>
            <pre id="response-content"></pre>
          </div>
        </div>
      </div>
    `
  }

  async testProtectedEndpoint() {
    const token = localStorage.getItem("authToken")

    try {
      const response = await fetch("/api/protected-test", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      const responseDiv = document.getElementById("api-response")
      const responseContent = document.getElementById("response-content")

      responseDiv.style.display = "block"
      responseContent.textContent = JSON.stringify(data, null, 2)

      if (!response.ok) {
        responseDiv.style.background = "#fee2e2"
        responseDiv.style.color = "#dc2626"
      } else {
        responseDiv.style.background = "#dcfce7"
        responseDiv.style.color = "#16a34a"
      }
    } catch (error) {
      this.showError("Failed to test protected endpoint: " + error.message)
    }
  }

  logout() {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userData")
    location.reload()
  }

  showError(message) {
    const existingError = document.querySelector(".error-message")
    if (existingError) {
      existingError.remove()
    }

    const errorDiv = document.createElement("div")
    errorDiv.className = "error-message"
    errorDiv.style.cssText = `
      background: #fee2e2;
      color: #dc2626;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 16px;
      border: 1px solid #fecaca;
    `
    errorDiv.textContent = message

    this.form.insertBefore(errorDiv, this.form.firstChild)

    // Remove error after 5 seconds
    setTimeout(() => {
      if (errorDiv.parentNode) {
        errorDiv.remove()
      }
    }, 5000)
  }

  showSuccess(message) {
    const successDiv = document.createElement("div")
    successDiv.className = "success-message"
    successDiv.style.cssText = `
      background: #dcfce7;
      color: #16a34a;
      padding: 12px;
      border-radius: 8px;
      margin-bottom: 16px;
      border: 1px solid #bbf7d0;
    `
    successDiv.textContent = message

    this.form.insertBefore(successDiv, this.form.firstChild)

    // Remove success message after 3 seconds
    setTimeout(() => {
      if (successDiv.parentNode) {
        successDiv.remove()
      }
    }, 3000)
  }

  toggleMode() {
    this.isLogin = !this.isLogin
    this.clearForm()
    this.updateUI()
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword
    this.passwordInput.type = this.showPassword ? "text" : "password"

    // Update eye icon
    if (this.showPassword) {
      this.eyeIcon.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `
    } else {
      this.eyeIcon.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `
    }
  }

  updateUI() {
    // Update titles and descriptions
    if (this.isLogin) {
      this.cardTitle.textContent = "Welcome back"
      this.cardDescription.textContent = "Enter your credentials to access your account"
      this.submitBtn.textContent = "Sign In"
      this.toggleText.textContent = "Don't have an account?"
      this.modeToggleBtn.textContent = "Sign up here"
    } else {
      this.cardTitle.textContent = "Create your account"
      this.cardDescription.textContent = "Fill in your details to get started"
      this.submitBtn.textContent = "Create Account"
      this.toggleText.textContent = "Already have an account?"
      this.modeToggleBtn.textContent = "Sign in here"
    }

    // Show/hide form fields with animation
    if (this.isLogin) {
      this.nameGroup.style.display = "none"
      this.confirmPasswordGroup.style.display = "none"
      this.forgotPassword.classList.remove("hidden")
      this.inputs.name.removeAttribute("required")
      this.inputs.confirmPassword.removeAttribute("required")
    } else {
      this.nameGroup.style.display = "block"
      this.confirmPasswordGroup.style.display = "block"
      this.forgotPassword.classList.add("hidden")
      this.inputs.name.setAttribute("required", "")
      this.inputs.confirmPassword.setAttribute("required", "")
    }
  }

  clearForm() {
    this.formData = {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    }

    Object.values(this.inputs).forEach((input) => {
      input.value = ""
    })
  }
}

let authForm
document.addEventListener("DOMContentLoaded", () => {
  authForm = new AuthForm()
})
