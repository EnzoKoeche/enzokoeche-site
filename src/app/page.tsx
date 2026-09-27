import About from "@/components/About";
import Ask from "@/components/Ask";
import Contact from "@/components/Contact";
import Guestbook from "@/components/Guestbook";
import Hero from "@/components/Hero";
import Method from "@/components/Method";
import Projects from "@/components/Projects";
import Resume from "@/components/Resume";
import Stack from "@/components/Stack";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Stack />
      <Projects />
      <Method />
      <Ask />
      <Resume />
      <Guestbook />
      <Contact />
    </>
  );
}
