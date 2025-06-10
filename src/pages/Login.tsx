import sketchbook from '../assets/images/sketchbook.svg'
import logo_catpaw from '../assets/images/logo_catpaw.svg'
import logo_typo from '../assets/images/logo_typo.svg'
import Button from '../components/common/Button'
import kisu from '../assets/images/kisu_.svg'
import logo_google from '../assets/images/logo_google.svg'
import logo_discord from '../assets/images/logo_discord.svg'
import FootPrint from '../components/login/FootPrint'

export default function Login() {
  return (
    <>
      <div className="relative w-[100vw] h-[100vh]">
        <FootPrint position="right-[24%] bottom-[40px]" />
        <FootPrint position="right-[50%] top-[20px]" delay={0.9} flip />

        <img
          src={sketchbook}
          alt="sketch book"
          className=" h-[498px] absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]"
        />
        <div className="relative h-[430px] aspect-[444/269] bg-white top-1/2 left-1/2 translate-x-[-50%] translate-y-[-45%] flex flex-col justify-center items-center gap-[30px]">
          <div className="flex items-center cursor-pointer">
            <img src={logo_catpaw} alt="logo_catpaw" className="size-[87px]" />
            <img src={logo_typo} alt="logo_typo" className="h-[85px]" />
          </div>
          <div className="flex flex-col gap-[8px] ">
            <div className=" w-[351px] h-[54px] px-[55px] flex items-center gap-[15px] border-[1px] border-[var(--grey-100)] rounded-[10px] cursor-pointer">
              <img
                src={logo_google}
                alt="google logo"
                className="size-[24px]"
              />
              <span className="text-[20px] font-roboto">
                Continue with Google
              </span>
            </div>
            <div className="w-[351px] h-[54px] px-[55px] flex items-center gap-[15px] bg-[#5865F2] rounded-[10px] cursor-pointer">
              <img
                src={logo_discord}
                alt="discord logo"
                className="size-[28px]"
              />
              <span className="text-[20px] text-white">
                Continue with Discord
              </span>
            </div>
            <Button className="w-[351px] h-[54px] px-[55px] flex justify-center items-center gap-[15px]">
              <img src={kisu} alt="kisu" className="size-[28px]" />
              <span className="text-[20px]">Continue as Guest</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
