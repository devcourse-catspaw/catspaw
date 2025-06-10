import logo_catpaw from '../../assets/images/logo_catpaw.svg'
import logo_typo from '../../assets/images/logo_typo.svg'
import Button from '../common/Button'

export default function NavBar() {
  return (
    <>
      <div className="w-full px-[80px] py-[14px] flex justify-between items-center">
        <div className="flex items-center gap-[10px]">
          <img src={logo_catpaw} alt="cat's paw logo" className="size-[60px]" />
          <img src={logo_typo} alt="logo text" className="h-[56px]" />
        </div>
        <div className="flex items-center gap-[12px]">
          <Button className="w-[140px] h-[38px] text-[14px]"> Lounge </Button>
          <Button className="w-[140px] h-[38px] text-[14px] px-[27px]">
            Join to Draw
          </Button>
        </div>
      </div>
    </>
  )
}
