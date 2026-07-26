import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-md w-full bg-card rounded-2xl shadow-sm border border-border p-8 flex flex-col gap-6">
        <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center text-primary mb-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"></path>
          </svg>
        </div>
        
        <h1 className="text-3xl font-bold text-foreground">Welcome to Your Shop</h1>
        <p className="text-muted-foreground text-lg">
          Your digital dukaan is ready. Start adding products and sharing your link on WhatsApp to grow your business.
        </p>
        
        <div className="flex flex-col gap-4 mt-4">
          <button className="w-full bg-primary text-primary-foreground font-semibold py-4 rounded-xl hover:bg-primary-container transition-colors text-lg">
            Add First Product
          </button>
          
          <button className="w-full bg-white text-[#25D366] border-2 border-[#25D366] font-semibold py-4 rounded-xl hover:bg-[#F0FDF4] transition-colors flex items-center justify-center gap-2 text-lg">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.031 0C5.38 0 0 5.383 0 12.036c0 2.124.553 4.195 1.604 6.012L.15 23.4l5.485-1.439a11.96 11.96 0 006.396 1.834h.005c6.648 0 12.03-5.383 12.03-12.036S18.681 0 12.031 0zm0 21.792h-.004a9.92 9.92 0 01-5.06-1.378l-.362-.214-3.766.987.998-3.673-.236-.375a9.927 9.927 0 01-1.517-5.342c0-5.474 4.455-9.929 9.932-9.929 2.651 0 5.143 1.033 7.018 2.91 1.874 1.877 2.906 4.37 2.906 7.02 0 5.474-4.454 9.928-9.928 9.928c0 0 0 .002.001-.002z"/>
              <path d="M17.498 13.82c-.302-.15-1.785-.88-2.062-.981-.277-.101-.479-.151-.68.15-.202.302-.781.982-.958 1.182-.176.202-.353.227-.655.076-.302-.151-1.272-.469-2.423-1.495-.895-.798-1.5-1.784-1.676-2.086-.176-.302-.019-.465.132-.615.136-.136.302-.352.453-.529.151-.176.202-.301.302-.503.101-.202.05-.378-.026-.529-.075-.15-.68-1.637-.932-2.241-.245-.588-.495-.508-.68-.517l-.58-.009c-.201 0-.528.075-.805.378-.277.302-1.057 1.032-1.057 2.516 0 1.484 1.082 2.919 1.233 3.12.151.202 2.129 3.251 5.158 4.557.72.311 1.282.497 1.721.636.723.23 1.382.197 1.899.119.58-.088 1.785-.73 2.037-1.434.252-.705.252-1.309.176-1.435-.075-.126-.277-.202-.579-.352z"/>
            </svg>
            Share on WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
