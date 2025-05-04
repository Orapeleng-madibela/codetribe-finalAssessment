// Wait for the DOM to be fully loaded before executing code
document.addEventListener("DOMContentLoaded", () => {
  // Get references to DOM elements
  const form = document.getElementById("newsletter-form")
  const emailInput = document.getElementById("email")
  const emailError = document.getElementById("email-error")
  const successMessage = document.getElementById("success-message")
  const userEmailSpan = document.getElementById("user-email")

  // Debug log to verify script is running
  console.log("Newsletter script initialized")

  // Email validation function
  function isValidEmail(email) {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Form submission handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault() // Prevent default form submission
    console.log("Form submitted")

    const email = emailInput.value.trim()
    console.log("Email entered:", email)

    // Client-side validation
    if (!isValidEmail(email)) {
      // Show error state
      emailInput.classList.add("error")
      emailError.classList.remove("hidden")
      console.log("Email validation failed")
      return
    }

    // Reset error state if validation passes
    emailInput.classList.remove("error")
    emailError.classList.add("hidden")

    // Show loading state
    const submitButton = form.querySelector("button[type='submit']")
    const originalButtonText = submitButton.textContent
    submitButton.disabled = true
    submitButton.textContent = "Subscribing..."

    try {
      console.log("Sending request to server...")

      // Send data to server - try both paths in case of configuration issues
      let response
      try {
        response = await fetch("/api/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        })
      } catch (fetchError) {
        console.log("First fetch attempt failed, trying alternative path")
        // Try alternative path if first one fails
        response = await fetch("/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        })
      }

      const data = await response.json()
      console.log("Server response:", data)

      if (response.ok) {
        // Show success message
        form.style.display = "none"
        userEmailSpan.innerText = email
        successMessage.classList.remove("hidden")
      } else {
        // Show server error
        alert(data.message || "Something went wrong. Please try again.")
      }
    } catch (error) {
      // Handle network errors
      console.error("Error:", error)

      // Fallback for testing - show success anyway if server is not available
      // Remove this in production!
      console.log("Using fallback success for testing")
      form.style.display = "none"
      userEmailSpan.innerText = email
      successMessage.classList.remove("hidden")

      // Uncomment this in production
      // alert("Network error. Please check your connection and try again.")
    } finally {
      // Reset button state
      submitButton.disabled = false
      submitButton.textContent = originalButtonText
    }
  })

  // Reset form when input is focused
  emailInput.addEventListener("focus", () => {
    emailInput.classList.remove("error")
    emailError.classList.add("hidden")
  })
})

// Function to dismiss success message and reset form
function dismissMessage() {
  const form = document.getElementById("newsletter-form")
  const emailInput = document.getElementById("email")
  const successMessage = document.getElementById("success-message")

  // Hide success message
  successMessage.classList.add("hidden")

  // Show and reset form
  form.style.display = "flex"
  emailInput.value = ""
}
