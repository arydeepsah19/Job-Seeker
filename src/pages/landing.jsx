import {Link} from "react-router-dom";
import {Button} from "@/components/ui/button";
import { Carousel, CarouselItem,CarouselContent} from "../components/ui/carousel";
import companies from "../data/companies.json";
import faqs from "../data/faq.json";
import Autoplay from "embla-carousel-autoplay"
import {Card, CardHeader, CardContent, CardTitle} from "@/components/ui/card";
import {Accordion,AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";

const LandingPage= ()=> {
  return (
    <main className="flex flex-col gap-10 sm:gap-20 py-10 sm:py-20">
      <section className="text-center">
        <h1 className="flex flex-col items-center justify-center gradient-title text-4xl font-extrabold sm:text-6xl lg:text-8xl tracking-tighter py-4">Find your Dream Job{" "}
          <span className="flex items-center gap-2 lg:gap-6">
            and get {" "} <img src="/logo.png" alt="logo" className="h-14 sm:h-24 lg:h-32" />
          </span>
        </h1>
        <p className="text-gray-300 sm:mt-4 text-xs lg:text-xl">
          Explore thousands of job listings or find your perfect match with our advanced search tools.
        </p>
      </section>
      <div className="flex justify-center gap-6 sm:gap-8">
        <Link to="/jobs">
          <Button variant="blue" size="xl">Find Job</Button>
        </Link>
        <Link to="/post-job">
          <Button variant="destructive" size="xl">Post a Job</Button>
        </Link>
      </div>

      {/* carousel */}
      <Carousel plugins={[ Autoplay({delay: 2000}) ]} className="w-full py-10">
        <CarouselContent className="flex gap-5 sm:gap-20 items-center">
          {companies.map(({name,id,path}) =>{
            return (
              <CarouselItem key={id} className="basis-1/3 lg:basis-1/6">
                <img src={path} alt={name} className="h-9 sm:h-14 object-contain"/>
              </CarouselItem>
            )
          })}
        </CarouselContent>
      </Carousel>

      {/* banner */}
          <img src="/banner.jpeg" alt="job Seeker" className="w-full" />

      {/* card */}
      <section className="grid grid-cols-1 md:grid-col-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>For Job Seekers</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Find your dream job and take the next step in your career.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>For Employees</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Post job openings and find the best candidates for your company.</p>
          </CardContent>
        </Card>
      </section>

      {/* Accordion */}

      <Accordion type="single" collapsible>
        {faqs.map((faq,index) => {
          return (
            <AccordionItem key={index} value={`item-${index+1}`}>
              <AccordionTrigger className="text-lg">{faq.question}</AccordionTrigger>
              <AccordionContent className="text-sm">{faq.answer}</AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </main>
  )
}

export default LandingPage;
