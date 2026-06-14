import { useEffect, useState } from 'react'
import { viewProfilePageStyles as s } from '../assets/dummyStyles'
import { Edit3, Loader2, Save, X } from 'lucide-react';

// toast component
const Toast = ({message, type = "success", onClose}) => {
    useEffect(()=> {
        const timer = setTimeout(() => {
            onClose
        }, 3000);
        return () => clearTimeout(timer)
    }, [onClose])

    return (
        <div className={s.toast.container}>
            <div className={`${s.toast.card} ${
                type === 'success' ? s.toast.cardSuccess : s.toast.cardError
            }`} />
            <div className={`${s.toast.indicator} ${
                type === 'success' ? s.toast.indicatorSuccess : s.toast.indicatorError
            }`}>
                <span className={s.toast.message}>{message}</span>
                <button onClick={onClose} className={s.toast.closeButton}><X className={s.toast.closeIcon} /></button>
            </div>
        </div>
    )
}

const ViewProfile = () => {
    const [isEditting, setIsEditting] = useState(false);
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        resume: null,
    })

    const [originalProfile, setOriginalProfile] = useState(null);
    const [toast, setToast] = useState(null)
    const [isSaving, setIsSaving] = useState(false)

    // to fetch user profile
    useEffect(()=>{
        const fetchProfile = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("jobportal_user"));
                const res = await fetch("http://localhost:5000/api/user/profile", {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                })

                const data = await res.json()
                setProfile({
                    name: data.user.name || '',
                    email: data.user.email || '',
                    phone: data.user.phone || '',
                    resume: data.user.resume || null,
                });
                setOriginalProfile(data.user);
            } catch (error) {
                console.error(error);
            }
        };
        fetchProfile;
    }, [])

    const handleChange = (e) => {
        const {name, value} = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handlePhoneChange = (e) => {
        const raw = e.target.value;
        const digits = raw.replace(/\D/g, "").slice(0,10);
        setProfile(prev => ({
            ...prev, phone: digits
        }))
    }

    const handleResumeUpload = (e) {
        const file =e.target.file[0];
        if(!file) return;

        setProfile((prev) => ({
            ...prev,
            resume: file
        }))
    }

    const handleDeleteResume = () => {
        setProfile((prev) => ({
            ...prev, resume: null
        }))
    }

    // to validate each form fields
     const validate = () => {
    if (!profile.name.trim()) return "Name is required";
    if (!profile.email.trim()) return "Email is required";
    if (!/\S+@\S+\.\S+/.test(profile.email)) return "Email is invalid";
    if (!profile.phone) return "Phone is required";
    if (!/^\d{10}$/.test(profile.phone))
      return "Phone must be exactly 10 digits";

    return null;
  };

//   to handle the saving the user profile
  const handleSave = async () => {
    const error = validate();
    if (error) {
      setToast({ message: error, type: "error" });
      return;
    }

    try {
      setIsSaving(true);
      const user = JSON.parse(localStorage.getItem("jobportal_user"));
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("email", profile.email);
      formData.append("phone", profile.phone);

      if (profile.resume instanceof File) {
        formData.append("resume", profile.resume);
      }
      const res = await fetch("http://localhost:5000/api/user/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });
      const data = await res.json();
      setProfile({
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        resume: data.user.resume,
      });
      setOriginalProfile(data.user);
      setIsEditing(false);
      setToast({ message: "profile updated!", type: "success" });
    } catch (err) {
      setToast({ message: "Update failed", type: "error" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  }; // to cancel the update on the profile

  const getFileName = (resume) => {
    if (!resume) return "";
    if (resume instanceof File) return resume.name;
    if (typeof resume === "string") {
      return (
        resume.split("/").pop().split("-").slice(1).join("-") ||
        resume.split("/").pop()
      );
    }
    return "Resume";
  };

//   to open the uploaded resume on the browser on a new page
  const handleViewResume = () => {
    if (!profile.resume) return;

    if (profile.resume instanceof File) {
      const url = URL.createObjectURL(profile.resume);
      window.open(url, "_blank");
    } else if (typeof profile.resume === "string") {
      const fullUrl = `http://localhost:5000/api/user/resume/${originalProfile._id}`;

      const link = document.createElement("a");
      link.href = fullUrl;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className={s.container}>
        <div className={s.innerContainer}>
            <div className={s.header}>
                <h1 className={s.headerTitle}>My Profile</h1>

                {isEditting ? (
                    <button onClick={()=> setIsEditting(true)} className={s.editButton}>
                        <Edit3 className={s.editIcon} />
                        Edit Profile
                    </button>
                ) : (
                    <div className={s.actionButtons}>
                        <button className={s.cancelButton} onClick={handleCancel}>
                            <X className={s.cancelButton} />
                            Cancel
                        </button>

                        <button onClick={handleSave} disabled={isSaving} className={`${s.saveButton} ${
                            isSaving ? s.saveButtonDisabled : ""
                        }`}>
                            {isSaving ? (
                                <>
                                    <Loader2 className={s.savingSpinner} />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className={s.saveIcon} />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>

            {/* create profile card */}
        </div>
    </div>
  )
}

export default ViewProfile