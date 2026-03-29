import Button from "@/components/ui/Button";

export default function AboutSection() {
  return (
    <section
      id="about"
      className="bg-warm px-[2.5rem] py-[4rem] grid grid-cols-1 md:grid-cols-2 gap-[4rem] items-center"
    >
      <div className="aspect-[4/3] bg-[#C5B49A] flex items-center justify-center">
        <span className="font-serif text-[18px] text-brown/[0.6]">
          Product photo here
        </span>
      </div>
      <div>
        <p className="text-[11px] tracking-[2px] uppercase text-olive mb-[1rem]">
          Our Story
        </p>
        <h2 className="font-serif text-[38px] leading-[1.2] text-dark mb-[1.5rem]">
          Made by hand,
          <br />
          made with love.
        </h2>
        <p className="text-[14px] leading-[1.9] text-muted mb-[2rem]">
          Every Ventolivo soap is crafted in small batches using cold-process
          methods and the finest natural ingredients. No shortcuts, no
          chemicals — just pure, honest skincare.
        </p>
        <Button variant="secondary">Learn More</Button>
      </div>
    </section>
  );
}
