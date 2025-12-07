import { useEffect, useState } from "react";
import Header from "../HeaderComp";
import GuestFilePreview from "./GuestFilePreview";
import GuestFileUpload from "./GuestFileUpload";
import Footer from "../Footer";

const GuestHomePage = () => {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    const storedFiles = JSON.parse(localStorage.getItem("guestFiles")) || [];
    setFiles(storedFiles);
  }, []);

  const updateFiles = (newFiles) => {
    setFiles(newFiles);
    localStorage.setItem("guestFiles", JSON.stringify(newFiles));
  };

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground">
      <Header />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        </div>

        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in">
            Share Files <span className="text-primary">Instantly</span> & <span className="text-primary">Securely</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up">
            Upload documents, images, and videos. Share them with a link or QR code.
            No sign-up required for quick storage.
          </p>

          <div className="flex justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <button onClick={() => document.getElementById('upload-section').scrollIntoView({ behavior: 'smooth' })} className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity shadow-lg shadow-primary/25">
              Start Uploading
            </button>
            <button className="px-8 py-3 bg-secondary text-secondary-foreground rounded-full font-medium hover:bg-secondary/80 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </section>

      <main id="upload-section" className="flex-1 container mx-auto px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="bg-card border border-border rounded-xl shadow-sm p-6 md:p-8">
            <GuestFileUpload guestFiles={files} updateFiles={updateFiles} />
          </div>

          {files.length > 0 && (
            <div className="bg-card border border-border rounded-xl shadow-sm p-6 md:p-8">
              <GuestFilePreview guestFiles={files} />
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default GuestHomePage;