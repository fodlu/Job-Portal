import Banner from '../components/Banner';
import Candidate from '../components/Candidate';
import Career from '../components/Career';
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
    </div>
  )
}

export default Home