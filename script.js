// Wait for the DOM to be fully loaded before executing code
document.addEventListener("DOMContentLoaded", () => {
  // Get references to DOM elements
  const form = document.getElementById("newsletter-form")
  const emailInput = document.getElementById("email")
  const emailError = document.getElementById("email-error")
  const successMessage = document.getElementById("success-message")
  const userEmailSpan = document.getElementById("user-email")

  // Email validation function
  function isValidEmail(email) {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Form submission handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault() // Prevent default form submission

    const email = emailInput.value.trim()

    // Client-side validation
    if (!isValidEmail(email)) {
      // Show error state
      emailInput.classList.add("error")
      emailError.classList.remove("hidden")
      return
    }

    // Reset error state if validation passes
    emailInput.classList.remove("error")
    emailError.classList.add("hidden")

    try {
      // Send data to server
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

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
      alert("Network error. Please check your connection and try again.")
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
