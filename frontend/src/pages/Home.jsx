import Banner from '../components/Banner';
import Candidate from '../components/Candidate';
import Career from '../components/Career';
import Footer from '../components/Footer';
import InterviewQuestion from '../components/InterviewQuestion';
import Navbar from '../components/Navbar';

const Home = () => {
  return (
    <div>
        <Navbar />
        <Banner />
        <Candidate />
        <Career />
        <InterviewQuestion />
        <Footer />
    </div>
  )
}

export default Home