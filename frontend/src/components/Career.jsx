import React from 'react'
import { careerPageStyles as s } from '../assets/dummyStyles'

const Career = () => {
    const [companies, setCompanies] = useState([]);

    // Fetch companies
    useEffect(() => {
      const fetchCompanies = async () => {
        try {
            const res = await axios
        } catch (error) {

        }
      }

      return () => {
        second
      }
    }, [third])

  return (
    <div className={s.pageContainer}>
        <div className={s.contentWrapper}>
            <div className={s.header}>
                <h1 className={s.headerTitle}>Join Our <span className={s.headerHighlight}>Featured</span>{" "} Companies</h1>
                <p className={s.headerSubtitle}>Discover career opportunities with industry leaders who are actively hiring. Your next big role awaits!</p>
            </div>

            <div className={s.rowContainer}>
                <div className={s.scrollRowRightToLeft}>

                </div>
            </div>
        </div>
    </div>
  )
}

export default Career