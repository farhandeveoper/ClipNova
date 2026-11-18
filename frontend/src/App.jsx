import useClipJob from "./hooks/useClipJob";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Pricing from "./components/Pricing";
import Faq from "./components/Faq";
import Cta from "./components/Cta";
import Footer from "./components/Footer";
import Processing from "./components/Processing";
import Results from "./components/Results";

export default function App() {
  const { job, error, start, reset } = useClipJob();

  if (job && job.status === "done") return <><Nav /><Results job={job} onReset={reset} /><Footer /></>;
  if (job) return <><Nav /><Processing job={job} onReset={reset} /></>;

  return (
    <>
      <Nav />
      <Hero onSubmit={start} error={error} />
      <Marquee />
      <Features />
      <HowItWorks />
      <Pricing />
      <Faq />
      <Cta />
      <Footer />
    </>
  );
}
