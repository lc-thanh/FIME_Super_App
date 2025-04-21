import { Button } from "@/components/ui/button";
import { FimeTitle } from "@/components/fime-title";

export default function Home() {
  return (
    <div>
      <div className="font-bold w-fit bg-clip-text text-transparent bg-gradient-to-br from-30% from-fimeOrange to-fimeYellow to-90%">
        FIME Gradient
      </div>
      <FimeTitle className="font-bold">Small title</FimeTitle>
      <FimeTitle className="text-4xl font-bold leading-normal">
        My component...
      </FimeTitle>
      <Button className="font-bold bg-gradient-to-br from-fimeOrange from-30% to-fimeYellow to-90% shadow hover:opacity-90 transition-all duration-200">
        Lorem ipsum
      </Button>
      <Button className="ms-2">Default button</Button>
      <Button variant="gradient">Test</Button>
      <Button
        variant="animated-gradient"
        className="m-[10px] px-[45px] py-[15px]"
      >
        Gradient with Animation
      </Button>
    </div>
  );
}
