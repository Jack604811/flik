import Image from "next/image";
export default function Home() {
  return (
    <>
      <div className="flex flex-col items-center min-h-screen py-12">
        <Image src={"/assets/logo.svg"} width={300} height={300} alt="logo" />
        <h1 className="mt-6 text-3xl font-bold lg:text-5xl xl:text-6xl">Welcome to shipit!</h1>
        <p className="mt-8 text-lg md:text-xl">
          I hope you build something amazing.
        </p>
        <p className="mt-8 text-lg md:text-xl">
          If you need help to get started, checkout the docs.
        </p>
        <a className="bg-accent text-accent-foreground px-4 rounded py-2 mt-8 font-bold" rel="noopener noreferrer" href="https://docs.shipit.so/" target="_blank">
          Go to docs
        </a>
        <p className="mt-8 text-lg md:text-xl">
          Happy coding! 🚀
        </p>
      </div>

    </>
  );
}
