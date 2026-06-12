import Banner from '../components/Banner';
import Candidate from '../components/Candidate';
import Career from '../components/Career';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div>
        <Navbar />
        <Banner />
        <Candidate />
        <Career />
    </div>
  )
}

export default Home