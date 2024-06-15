import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'
import './NavBar.css'
function NavBar() {
	return (
		<nav id="navbar">
			<div id="navbar-left">
				<FontAwesomeIcon icon={faBars} style={{fontSize:'1.5rem'}} inverse />
				<h1>Telegram</h1>
			</div>

			<FontAwesomeIcon icon={faMagnifyingGlass} style={{fontSize:'1.5rem'}} inverse />
		</nav>	
	)
}
export default NavBar
