"use client";
import {Github, Linkedin, Mail, MapPin, Phone, Send, Twitter,} from "lucide-react";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";

export const ContactSection = () => {
  // const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const {name, value} = e.target;
    setFormData((prev) => ({...prev, [name]: value}));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      // toast({
      //   title: "Message sent!",
      //   description: "Thanks for reaching out. I'll get back to you soon.",
      // });
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    }, 1500);
  };

  return (
    <section id="contact" className="px-4 py-16">
      <div className="container mx-auto">
        <h2
          className="relative mb-4 mb-6 font-bold text-3xl after:absolute after:bottom-0 after:left-0 after:h-1 after:w-12 after:rounded after:bg-primary after:content-[''] md:text-4xl"
          data-aos="fade-up"
        >
          Get In Touch
        </h2>
        <p
          className="mb-10 max-w-3xl text-lg"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          Interested in working together or have a question? Feel free to reach
          out through the form below or connect with me on social media.
        </p>

        <div className="grid gap-10 md:grid-cols-2">
          {/* Contact Form */}
          <div
            className="glass-card p-6"
            data-aos="fade-up"
            data-aos-delay="200"
          >
            <h3 className="mb-4 font-semibold text-xl">Send a Message</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="mb-1 block font-medium text-sm"
                >
                  Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="mb-1 block font-medium text-sm"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="mb-1 block font-medium text-sm"
                >
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="What is this regarding?"
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-1 block font-medium text-sm"
                >
                  Message
                </label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Your message here..."
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 animate-spin rounded-full border-white border-b-2"/>
                    <span>Sending...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Send size={16}/>
                    <span>Send Message</span>
                  </div>
                )}
              </Button>
            </form>
          </div>

          {/* Contact Information */}
          <div data-aos="fade-up" data-aos-delay="300">
            <h3 className="mb-6 font-semibold text-xl">Contact Information</h3>

            <div className="mb-8 space-y-6">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Mail className="text-primary" size={20}/>
                </div>
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <p className="text-muted-foreground">
                    adebayomuhammad47@example.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Phone className="text-primary" size={20}/>
                </div>
                <div>
                  <h4 className="font-semibold">Phone</h4>
                  <p className="text-muted-foreground">+234 706651901</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <MapPin className="text-primary" size={20}/>
                </div>
                <div>
                  <h4 className="font-semibold">Location</h4>
                  <p className="text-muted-foreground">Osogbo, Osun</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="mb-4 font-semibold text-xl">Connect With Me</h3>
              <div className="flex gap-4">
                <a
                  href="https://github.com/Muhammadcod"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-secondary p-3 transition-colors hover:bg-primary/10"
                  aria-label="GitHub"
                >
                  <Github className="text-foreground" size={20}/>
                </a>
                <a
                  href="https://www.linkedin.com/in/adebayo-mohammed"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-secondary p-3 transition-colors hover:bg-primary/10"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="text-foreground" size={20}/>
                </a>
                <a
                  href="https://x.com/muhbiy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-secondary p-3 transition-colors hover:bg-primary/10"
                  aria-label="Twitter"
                >
                  <Twitter className="text-foreground" size={20}/>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
