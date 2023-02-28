
import { Link } from "react-router-dom"

const MenuIcon = (props: any) => {
   const {to, icon} = props
    return (
      <Link
         to={to}
         className="transition duration-300"
         draggable={false}
         data-testid="navigate-account-link"
      >
         {icon}
    </Link>
    )
}

export default MenuIcon