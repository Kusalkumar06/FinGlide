import React, { useReducer } from 'react'
import { MdEmail, MdPhone, MdLocationOn } from 'react-icons/md'
import { contactFormReducer, contactInitialState } from '../reducers/contactFormReducer'

function Contact() {
  const [state, dispatch] = useReducer(contactFormReducer, contactInitialState)

  const handleInputChange = (field, value) => {
    dispatch({ type: 'SET_FIELD', field, value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!state.name || !state.email || !state.message) {
      dispatch({ 
        type: 'SUBMIT_ERROR', 
        payload: 'Please fill in all required fields.' 
      })
      return
    }

    dispatch({ type: 'SUBMIT_START' })

    try {
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: state.name,
          email: state.email,
          message: state.message,
        }),
      })

      if (response.ok) {
        dispatch({ type: 'SUBMIT_SUCCESS' })
        setTimeout(() => {
          dispatch({ type: 'RESET_FORM' })
        }, 3000)
      } else {
        throw new Error('Failed to send message')
      }
    } catch {
      dispatch({ 
        type: 'SUBMIT_ERROR', 
        payload: 'Failed to send message. Please try again later.' 
      })
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-[#3A3A3A] text-3xl sm:text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-[#3B3F40] text-lg leading-relaxed">
          Have questions or feedback? We'd love to hear from you. Get in touch with our team.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#FFFAF4] border-2 border-[#DDDFDE] rounded-lg shadow p-6 sm:p-8">
          <h2 className="text-[#3A3A3A] text-2xl font-semibold mb-6">Get In Touch</h2>
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-[#D96D38] flex items-center justify-center mr-4 shrink-0">
                <MdEmail color="white" size={24} />
              </div>
              <div>
                <h3 className="text-[#3A3A3A] text-lg font-semibold mb-1">Email</h3>
                <p className="text-[#3B3F40] text-base">support@finglide.com</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-[#D96D38] flex items-center justify-center mr-4 shrink-0">
                <MdPhone color="white" size={24} />
              </div>
              <div>
                <h3 className="text-[#3A3A3A] text-lg font-semibold mb-1">Phone</h3>
                <p className="text-[#3B3F40] text-base">+91 98765 43210</p>
              </div>
            </div>

            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-[#D96D38] flex items-center justify-center mr-4 shrink-0">
                <MdLocationOn color="white" size={24} />
              </div>
              <div>
                <h3 className="text-[#3A3A3A] text-lg font-semibold mb-1">Location</h3>
                <p className="text-[#3B3F40] text-base">India</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-[#DDDFDE]">
            <h3 className="text-[#3A3A3A] text-lg font-semibold mb-3">Business Hours</h3>
            <div className="space-y-2 text-[#3B3F40]">
              <p className="flex justify-between">
                <span>Monday - Friday:</span>
                <span className="font-medium">9:00 AM - 6:00 PM IST</span>
              </p>
              <p className="flex justify-between">
                <span>Saturday:</span>
                <span className="font-medium">10:00 AM - 4:00 PM IST</span>
              </p>
              <p className="flex justify-between">
                <span>Sunday:</span>
                <span className="font-medium">Closed</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[#FFFAF4] border-2 border-[#DDDFDE] rounded-lg shadow p-6 sm:p-8">
          <h2 className="text-[#3A3A3A] text-2xl font-semibold mb-6">Send us a Message</h2>
          
          {state.success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              Thank you! Your message has been sent successfully. We'll get back to you soon.
            </div>
          )}

          {state.error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {state.error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-[#3A3A3A] text-base font-medium mb-2">
                Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="name"
                value={state.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#DDDFDE] rounded-lg focus:outline-none focus:border-[#D96D38] transition-colors"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-[#3A3A3A] text-base font-medium mb-2">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={state.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-4 py-3 border-2 border-[#DDDFDE] rounded-lg focus:outline-none focus:border-[#D96D38] transition-colors"
                placeholder="your.email@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-[#3A3A3A] text-base font-medium mb-2">
                Message <span className="text-red-600">*</span>
              </label>
              <textarea
                id="message"
                value={state.message}
                onChange={(e) => handleInputChange('message', e.target.value)}
                rows="6"
                className="w-full px-4 py-3 border-2 border-[#DDDFDE] rounded-lg focus:outline-none focus:border-[#D96D38] transition-colors resize-none"
                placeholder="Tell us how we can help you..."
                required
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={state.loading}
              className={`w-full py-3 px-6 rounded-lg text-white font-semibold text-lg transition-colors ${
                state.loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-[#D96D38] hover:bg-[#e05a38] cursor-pointer'
              }`}
            >
              {state.loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Contact
