
import { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import SiteFrame from "../../components/SiteFrame";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  function handleChange(e) {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    // This is a frontend-only form for now.
    // Connect it to a backend or email service to receive messages.
    alert("Thank you for contacting VÉLUNE!");

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  }

  return (
    <main className="w-full bg-[#491225]">
      <SiteFrame>
        <div className="bg-[#F5E8D5] text-[#491225]">

          {/* Heading */}
          <section className="text-center px-6 py-24 md:py-28">
            <p className="text-xs tracking-[5px] uppercase text-[#8B7276] mb-5">
              We Would Love to Hear From You
            </p>

            <h1 className="font-serif text-4xl md:text-6xl mb-7">
              Contact Us
            </h1>

            <p className="max-w-xl mx-auto text-sm leading-8 text-[#72515A]">
              Whether you have a question about our gold and diamond
              jewellery, need assistance with an order, or simply want
              to know more about VÉLUNE, we are here to help.
            </p>
          </section>

          {/* Contact Content */}
          <section className="px-6 md:px-12 lg:px-20 pb-24">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20">

              {/* Contact Information */}
              <div>
                <p className="text-xs tracking-[4px] uppercase text-[#8B7276] mb-5">
                  Get in Touch
                </p>

                <h2 className="font-serif text-3xl md:text-4xl mb-6">
                  We're Here for You
                </h2>

                <p className="text-sm leading-8 text-[#72515A] mb-12">
                  Our team is happy to assist you with product information,
                  jewellery details, orders and any other enquiries.
                  Get in touch and let us make your VÉLUNE experience special.
                </p>

                <div className="space-y-9">

                  <div className="flex items-start gap-5">
                    <Mail size={22} strokeWidth={1.5} />
                    <div>
                      <h3 className="font-serif text-xl mb-2">Email</h3>
                      <p className="text-sm text-[#72515A]">
                        velune@gmail.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <Phone size={22} strokeWidth={1.5} />
                    <div>
                      <h3 className="font-serif text-xl mb-2">Phone</h3>
                      <p className="text-sm text-[#72515A]">
                        +971 4 XXX XXXX
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <MapPin size={22} strokeWidth={1.5} />
                    <div>
                      <h3 className="font-serif text-xl mb-2">Location</h3>
                      <p className="text-sm text-[#72515A]">
                        UAE
                      </p>
                    </div>
                  </div>

                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-[#FEF7F2] p-7 md:p-10">
                <h2 className="font-serif text-2xl md:text-3xl mb-3">
                  Send Us a Message
                </h2>

                <p className="text-sm text-[#72515A] mb-8">
                  Fill in the details below and we'll be happy to assist you.
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">

                  <div>
                    <label className="block text-xs tracking-wider mb-2">
                      YOUR NAME
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      required
                      className="w-full bg-transparent border-b border-[#C4A9AF] py-3 text-sm outline-none focus:border-[#491225]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs tracking-wider mb-2">
                      EMAIL ADDRESS
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                      className="w-full bg-transparent border-b border-[#C4A9AF] py-3 text-sm outline-none focus:border-[#491225]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs tracking-wider mb-2">
                      SUBJECT
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What is your enquiry about?"
                      required
                      className="w-full bg-transparent border-b border-[#C4A9AF] py-3 text-sm outline-none focus:border-[#491225]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs tracking-wider mb-2">
                      YOUR MESSAGE
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Write your message..."
                      rows="4"
                      required
                      className="w-full bg-transparent border-b border-[#C4A9AF] py-3 text-sm outline-none resize-none focus:border-[#491225]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#491225] text-[#F5E8D5] py-4 text-xs tracking-[3px] uppercase hover:bg-[#350B19] transition-colors duration-300"
                  >
                    Send Message
                  </button>

                </form>
              </div>

            </div>
          </section>

          {/* Closing Section */}
          <section className="bg-[#491225] text-[#F5E8D5] text-center px-6 py-16">
            <p className="font-serif text-2xl md:text-3xl mb-4">
              Thank You for Choosing VÉLUNE
            </p>

            <p className="text-sm text-[#E5D5D8]">
              Your journey with timeless elegance starts here.
            </p>
          </section>

        </div>
      </SiteFrame>
    </main>
  );
}
