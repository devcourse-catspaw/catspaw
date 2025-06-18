import { useNavigate } from 'react-router-dom'
import catspaw from '../assets/images/logo_catpaw.svg'
import doodle1 from '../assets/images/doodle_small1.svg'
import doodle2 from '../assets/images/doodle_small2.svg'
import doodle3 from '../assets/images/doodle_small7.svg'
import doodle4 from '../assets/images/doodle_small4.svg'
import doodle5 from '../assets/images/doodle_small5.svg'
import doodle6 from '../assets/images/doodle_small6.svg'
import doodle7 from '../assets/images/doodle_small7.svg'
import notfound from '../assets/images/notfound.svg'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className="relative w-full min-h-screen">
      <nav className="px-20 py-8  w-full flex justify-between items-center">
        <div className="flex gap-5 items-center">
          <img
            src={catspaw}
            alt="Cat's Paw 로고"
            className="w-15 cursor-pointer"
            onClick={() => navigate('/')}
          />
        </div>
      </nav>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <img src={notfound} alt="notfound 이미지" />
      </div>
      <img
        src={doodle1}
        alt="낙서그림1"
        className="absolute left-[24px] bottom-[200px] w-[152px]"
      />
      <img
        src={doodle2}
        alt="낙서그림2"
        className="absolute left-[350px] bottom-1/2 w-[152px] rotate-[-34deg]"
      />
      <img
        src={doodle3}
        alt="낙서그림3"
        className="absolute bottom-[30px] left-1/2 -translate-x-[240px] w-[152px] rotate-[55deg]"
      />
      <img
        src={doodle4}
        alt="낙서그림4"
        className="absolute top-[10px] right-[115px] w-[152px] "
      />
      <img
        src={doodle5}
        alt="낙서그림5"
        className="absolute right-1 bottom-[68px] w-[152px] r"
      />
      <img
        src={doodle6}
        alt="낙서그림5"
        className="absolute right-1/2 top-[10px] w-[152px] r"
      />
      <img
        src={doodle7}
        alt="낙서그림5"
        className="absolute right-1 bottom-[68px] w-[152px] r"
      />
    </div>
  )
}
