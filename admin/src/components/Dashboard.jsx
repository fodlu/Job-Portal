import React, { useEffect } from 'react'
import { dashboardStyles as s } from '../assets/dummyStyles'
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

    const [companyFilter, setCompanyFilter] = useState('')
    const [roleFilter, setRoleFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState("active")
    const [loadoing, setLoadoing] = useState(true)
    const [dashboardStat, setDashboardStat] = useState({
        totalJobs: "0",
        closedJobs: "0",
        totalApplicants: "0",
        totalCompany: "0",
    })
    const [toast, setToast] = useState(null);
    const [jobs, setJobs] = useState([]);

    const navigate = useNavigate();

    // to fetchdata
    useEffect(()=> {
        const fetchData = async () {
            setLoadoing(true);
            try {
                const token = localStorage.getItem("token")

                if(!token) {
                    navigate('/login');
                    return
                }

                // to fetch stat
                const statsRes = await fetch("http://localhost:5000/api/job/admin/stats",
                {
                    headers: {Authorization: `Bearer ${token}`},
                },
            );

            const statsData = await statsRes.json();
            if(statsData.success) {
                setDashboardStat(statsData.stats);
            }

            // to fetch the jobs
            const jobsRes = await fetch("http://localhost:5000/api/job/admin/jobs",
                {
                    headers: {Authorization: `Bearer ${token}`},
                },
            );

            const jobsData = await jobsRes.json();
            if (jobsData.success) {
            const mappedJobs = jobsData.jobs.map((j) => ({
                id: j._id,
                name: j.companyName,
                role: j.roleName,
                location: j.location,
                category: j.category,
                logo: j.companyLogo?.startsWith("http")
                ? j.companyLogo
                : `http://localhost:5000${j.companyLogo || ""}`,
                applicants: j.applicantsCount || 0,
                status: j.status || "active",
            }));
            setJobs(mappedJobs);
            }
            } catch (error) {

            }
        }
    }, [])

  return (
    <div className={s.container}>

    </div>
  )
}

export default Dashboard