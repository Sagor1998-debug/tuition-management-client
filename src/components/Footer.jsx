export default function Footer() {
  return (
    <footer className="footer p-10 bg-base-200 text-base-content mt-auto">
      <div>
        <span className="footer-title">TuitionHub</span>
        <p>Best platform to find qualified tutors in Bangladesh</p>
      </div>
      <div>
        <span className="footer-title">Quick Links</span>
        <a className="link link-hover">Home</a>
        <a className="link link-hover">Tuitions</a>
        <a className="link link-hover">About</a>
      </div>
      <div>
        <span className="footer-title">Contact</span>
        <p>support@tuitionhub.com</p>
        <p>+880 1700 000 000</p>
      </div>
      <div>
        <span className="footer-title">Social</span>
        <div className="grid grid-flow-col gap-4">
          <a href="#"><img src="/facebook.svg" alt="fb" /></a>
          <a href="#"><img src="/x.svg" alt="X" /></a>
        </div>
      </div>
    </footer>
  );
}