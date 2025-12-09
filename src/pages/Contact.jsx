export default function Contact() {
  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="container mx-auto px-6">
        <h1 className="text-5xl font-bold text-center mb-8 text-emerald-800">Contact Us</h1>
        <div className="max-w-2xl mx-auto bg-base-100 rounded-xl shadow-lg p-10">
          <p className="text-center text-lg mb-8">Have questions? We'd love to hear from you!</p>
          <div className="space-y-6 text-center">
            <p><strong>Email:</strong> support@tuitionhub.com</p>
            <p><strong>Phone:</strong> +880 123456789</p>
            <p><strong>Address:</strong> Dhaka, Bangladesh</p>
          </div>
        </div>
      </div>
    </div>
  );
}