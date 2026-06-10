import React from 'react'
import {viewApplicantsPageStyles as s} from '../assets/dummyStyles'
import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const ViewApplicantPage = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const {jobId, role, companyName} = location.state || {};
    const [loading, setLoading] = useState(true)
    const [filtered, setFiltered] = useState([])

    // to fetch the applicants apply on that jobId
    useEffect(() => {
      const fetchApplicants = async () => {
        if(!jobId){
            setLoading(false)
            return;
        }
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5000/api/application/${jobId}/applicants`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            if(data.success) {
                const mapped = data.applicants.map((app) => ({
                    id: app.applicationId,
                    name: app.name,
                    email: app.email,
                    phone: app.phone,
                    appliedAt: app.appliedDate,
                    resumeFile: app.resume,
                    userId: app._Id,
                    appliedForRole: role || data.jobName
                }))
                setFiltered(mapped)
            }
        } catch (error) {
            console.error("Error fetching the applicant: ", error)
        } finally {
            setLoading(false)
        }
      }
      fetchApplicants()
    }, [jobId, role])


  return (
    <div className={s.pageContainer}>
        <button className={} onClick={() => Navigate(-1)}>
            <ArrowLeft className={s.backIcon} />
        </button>
    </div>
  )
}

export default ViewApplicantPage