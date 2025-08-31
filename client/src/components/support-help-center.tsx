import { useState } from "react";
import { MessageCircle, Phone, Mail, FileText, AlertCircle, CheckCircle, Clock, ChevronRight } from "./icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface SupportHelpCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SupportHelpCenter({ isOpen, onClose }: SupportHelpCenterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketData, setTicketData] = useState({
    subject: "",
    category: "",
    description: "",
    priority: "medium",
  });

  const supportCategories = [
    {
      id: "orders",
      title: "Order Issues",
      icon: <FileText className="h-5 w-5" />,
      description: "Problems with placing or tracking orders",
      faqs: [
        { q: "How do I track my order?", a: "You can track your order in real-time from the tracking modal after placing an order." },
        { q: "Can I cancel my order?", a: "You can cancel your order within 5 minutes of placing it by contacting support." },
        { q: "What if my order is delayed?", a: "We'll send you updates via SMS. You can also contact the supplier directly." },
      ]
    },
    {
      id: "payment",
      title: "Payment & Billing",
      icon: <AlertCircle className="h-5 w-5" />,
      description: "Payment issues and billing inquiries",
      faqs: [
        { q: "What payment methods do you accept?", a: "We accept cash on delivery, card payments, and mobile money." },
        { q: "Why was my payment declined?", a: "Check your card details and ensure sufficient funds. Contact your bank if issues persist." },
        { q: "Can I get a refund?", a: "Refunds are processed within 7 business days for valid cancellations." },
      ]
    },
    {
      id: "delivery",
      title: "Delivery Issues",
      icon: <Clock className="h-5 w-5" />,
      description: "Problems with delivery or suppliers",
      faqs: [
        { q: "How long does delivery take?", a: "Average delivery time is 30 minutes, but can vary based on location and supplier availability." },
        { q: "What if the supplier can't find my address?", a: "Ensure your address is accurate and provide landmarks. The supplier will call you." },
        { q: "Can I change my delivery address?", a: "Address changes must be made before the supplier starts delivery." },
      ]
    },
    {
      id: "account",
      title: "Account & Profile",
      icon: <CheckCircle className="h-5 w-5" />,
      description: "Account settings and profile management",
      faqs: [
        { q: "How do I update my profile?", a: "Go to your profile section and click edit to update your information." },
        { q: "How do I change my password?", a: "Use the 'Forgot Password' link on the login page or contact support." },
        { q: "Can I delete my account?", a: "Contact support to request account deletion. This action cannot be undone." },
      ]
    },
  ];

  const recentTickets = [
    {
      id: 1,
      subject: "Order #12345 was delayed",
      status: "resolved",
      category: "Delivery",
      createdAt: "2024-01-15",
      priority: "high",
    },
    {
      id: 2,
      subject: "Payment issue with card",
      status: "in_progress",
      category: "Payment",
      createdAt: "2024-01-14",
      priority: "medium",
    },
  ];

  const handleTicketSubmit = () => {
    console.log("Submitting ticket:", ticketData);
    setShowTicketForm(false);
    setTicketData({ subject: "", category: "", description: "", priority: "medium" });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-primary" />
              Support & Help Center
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              ×
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!selectedCategory && !showTicketForm && (
            <div className="space-y-6">
              {/* Quick Contact */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
                  <Phone className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Call Us</p>
                    <p className="text-sm text-gray-600">+234 800 123 4567</p>
                  </div>
                </Button>
                <Button variant="outline" className="flex items-center gap-2 h-auto p-4">
                  <Mail className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600">support@gomessage.ng</p>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2 h-auto p-4"
                  onClick={() => setShowTicketForm(true)}
                >
                  <FileText className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Submit Ticket</p>
                    <p className="text-sm text-gray-600">Get help online</p>
                  </div>
                </Button>
              </div>

              {/* Support Categories */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Browse Help Topics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {supportCategories.map((category) => (
                    <Button
                      key={category.id}
                      variant="outline"
                      className="flex items-center justify-between h-auto p-4 text-left"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-primary">{category.icon}</div>
                        <div>
                          <p className="font-medium">{category.title}</p>
                          <p className="text-sm text-gray-600">{category.description}</p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </Button>
                  ))}
                </div>
              </div>

              {/* Recent Tickets */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Your Recent Tickets</h3>
                <div className="space-y-3">
                  {recentTickets.map((ticket) => (
                    <div key={ticket.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-medium">{ticket.subject}</p>
                        <Badge 
                          variant={ticket.status === 'resolved' ? 'default' : 'secondary'}
                        >
                          {ticket.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Category: {ticket.category}</span>
                        <span>Priority: {ticket.priority}</span>
                        <span>Created: {ticket.createdAt}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* FAQ Section */}
          {selectedCategory && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setSelectedCategory(null)}>
                  ← Back
                </Button>
                <h3 className="text-lg font-semibold">
                  {supportCategories.find(c => c.id === selectedCategory)?.title} FAQ
                </h3>
              </div>
              <div className="space-y-3">
                {supportCategories.find(c => c.id === selectedCategory)?.faqs.map((faq, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <p className="font-medium mb-2">{faq.q}</p>
                    <p className="text-sm text-gray-600">{faq.a}</p>
                  </div>
                ))}
              </div>
              <Button 
                className="w-full" 
                onClick={() => setShowTicketForm(true)}
              >
                Still need help? Submit a ticket
              </Button>
            </div>
          )}

          {/* Ticket Form */}
          {showTicketForm && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setShowTicketForm(false)}>
                  ← Back
                </Button>
                <h3 className="text-lg font-semibold">Submit Support Ticket</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Subject</label>
                  <input
                    type="text"
                    value={ticketData.subject}
                    onChange={(e) => setTicketData({...ticketData, subject: e.target.value})}
                    placeholder="Brief description of your issue"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <select
                    value={ticketData.category}
                    onChange={(e) => setTicketData({...ticketData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Select a category</option>
                    {supportCategories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.title}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Priority</label>
                  <select
                    value={ticketData.priority}
                    onChange={(e) => setTicketData({...ticketData, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={ticketData.description}
                    onChange={(e) => setTicketData({...ticketData, description: e.target.value})}
                    placeholder="Describe your issue in detail..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    rows={4}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowTicketForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleTicketSubmit}
                    className="flex-1 bg-primary hover:bg-primary/90"
                    disabled={!ticketData.subject || !ticketData.category || !ticketData.description}
                  >
                    Submit Ticket
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}