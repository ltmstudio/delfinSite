import {
  Header,
  Hero,
  Categories,
  About,
  Partners,
  Products,
  Video,
  Footer,
  CustomCursor
} from '../../components';

export default function Home() {
  return (
    <div className="page">
      <CustomCursor />
      <Header />
      <main className="main">
        <Hero />
        <Categories />
        <About />
        <Partners />
        <Products />
        <Video />
        {/* <Contact /> */}
      </main>
      <Footer />
    </div>
  );
}
