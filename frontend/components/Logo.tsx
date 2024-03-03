import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex items-center font-bold text-white drop-shadow-lg text-xl">
      <Image className="w-[50px] h-[50px]" src={'/images/logo.png'} alt="Logo" width={50} height={50} />
    </div>
  )
}
