import React, { useState, useRef, useEffect } from 'react'
import "../style/home.scss"
import { useInterview } from '../hooks/useInterview.js'
import { useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth.js'
import Navbar from '../../../components/Navbar.jsx'
import RecentReportsSkeleton from '../../../components/SkeletonLoader.jsx'

const SAMPLE_JOB_DESC = `Senior Full Stack Engineer at TechCorp
Requirements:
- 4+ years experience with React, Node.js, TypeScript, and MongoDB
- Experience designing scalable REST APIs and WebSocket architecture
- Strong knowledge of CI/CD, Docker, and Cloud Deployment (AWS/Vercel)
- Excellent problem-solving, system design, and communication skills`

const Home = () => {
    const { user } = useAuth()
    const { generating, reportsLoading, generateReport, reports } = useInterview()
    const [ jobDescription, setJobDescription ] = useState("")
    const [ selfDescription, setSelfDescription ] = useState("")
    const [ selectedFile, setSelectedFile ] = useState(null)
    const [ validationError, setValidationError ] = useState("")
    const [ genProgress, setGenProgress ] = useState(15)
    const [ currentStep, setCurrentStep ] = useState(1)

    const resumeInputRef = useRef()
    const navigate = useNavigate()


    // Simulate multi-stage progress during AI generation
    useEffect(() => {
        let interval
        if (generating) {
            setGenProgress(10)
            setCurrentStep(1)

            interval = setInterval(() => {
                setGenProgress((prev) => {
                    if (prev < 35) {
                        setCurrentStep(1)
                        return prev + 3
                    } else if (prev < 65) {
                        setCurrentStep(2)
                        return prev + 2
                    } else if (prev < 88) {
                        setCurrentStep(3)
                        return prev + 1
                    } else if (prev < 96) {
                        setCurrentStep(4)
                        return prev + 0.5
                    }
                    return prev
                })
            }, 500)
        } else {
            setGenProgress(0)
            setCurrentStep(1)
        }
        return () => clearInterval(interval)
    }, [generating])

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
            setValidationError("")
        }
    }

    const removeFile = (e) => {
        e.stopPropagation()
        setSelectedFile(null)
        if (resumeInputRef.current) {
            resumeInputRef.current.value = ""
        }
    }

    const handleQuickSample = () => {
        setJobDescription(SAMPLE_JOB_DESC)
        setValidationError("")
    }

    const handleGenerateReport = async () => {
        setValidationError("")
        if (!user) {
            navigate("/login")
            return
        }

        if (!jobDescription.trim()) {
            setValidationError("Please paste or enter a Target Job Description.")
            return
        }

        const resumeFile = selectedFile || (resumeInputRef.current?.files ? resumeInputRef.current.files[0] : null)
        if (!resumeFile && !selfDescription.trim()) {
            setValidationError("Please upload a Resume OR fill in a Quick Self-Description to personalize your strategy.")
            return
        }

        try {
            const data = await generateReport({ jobDescription, selfDescription, resumeFile })
            if (data && data._id) {
                navigate(`/interview/${data._id}`)
            }
        } catch (err) {
            setValidationError("Failed to generate plan. Please verify backend connection and try again.")
        }
    }


    const formatFileSize = (bytes) => {
        if (!bytes) return ""
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
        return (bytes / (1024 * 1024)).toFixed(1) + " MB"
    }

    return (
        <div className='home-page-wrapper'>
            <Navbar />

            {/* AI Generation Overlay Modal */}
            {generating && (
                <div className='generation-overlay'>
                    <div className='overlay-backdrop-glow' />
                    <div className='generation-card'>
                        <div className='gen-icon-glow'>
                            <svg viewBox="0 0 24 24" fill="none" className="sparkle-spin" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="url(#genGrad)" />
                                <defs>
                                    <linearGradient id="genGrad" x1="2" y1="2" x2="22" y2="22" gradientUnits="userSpaceOnUse">
                                        <stop stopColor="#ff2d78" />
                                        <stop offset="1" stopColor="#9d4edd" />
                                    </linearGradient>
                                </defs>
                            </svg>
                        </div>

                        <h2>Generating Your Custom Interview Plan</h2>
                        <p className='gen-subtitle'>Our AI is processing your inputs and building a personalized prep strategy...</p>

                        <div className='progress-bar-wrapper'>
                            <div className='progress-bar-fill' style={{ width: `${Math.min(100, Math.floor(genProgress))}%` }} />
                        </div>
                        <span className='progress-percentage'>{Math.min(99, Math.floor(genProgress))}%</span>

                        {/* Multi-step Indicators */}
                        <div className='steps-list'>
                            <div className={`step-item ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                                <span className='step-dot' />
                                <span>1. Analyzing Job Requirements</span>
                            </div>
                            <div className={`step-item ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
                                <span className='step-dot' />
                                <span>2. Extracting Key Profile Skills</span>
                            </div>
                            <div className={`step-item ${currentStep >= 3 ? 'active' : ''} ${currentStep > 3 ? 'completed' : ''}`}>
                                <span className='step-dot' />
                                <span>3. Generating Questions &amp; Model Answers</span>
                            </div>
                            <div className={`step-item ${currentStep >= 4 ? 'active' : ''}`}>
                                <span className='step-dot' />
                                <span>4. Finalizing 7-Day Prep Roadmap</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <main className='home-page'>

                {/* Page Header */}
                <header className='page-header'>
                    <h1>Create Your Custom <span className='highlight'>Interview Plan</span></h1>
                    <p>Let our AI analyze job requirements and your profile to build a tailored winning strategy.</p>
                </header>

                {/* Validation Banner */}
                {validationError && (
                    <div className='validation-banner'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        <span>{validationError}</span>
                    </div>
                )}

                {/* Main Card */}
                <div className='interview-card'>
                    <div className='interview-card__body'>

                        {/* Left Panel - Job Description */}
                        <div className='panel panel--left'>
                            <div className='panel__header'>
                                <span className='panel__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
                                </span>
                                <h2>Target Job Description</h2>
                                <button type="button" onClick={handleQuickSample} className='quick-sample-btn'>+ Sample</button>
                                <span className='badge badge--required'>Required</span>
                            </div>
                            <textarea
                                value={jobDescription}
                                onChange={(e) => { 
                                    setJobDescription(e.target.value) 
                                    if (validationError) setValidationError("")
                                }}
                                className='panel__textarea'
                                placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer requires React, TypeScript, System Design, and REST APIs...'`}
                                maxLength={5000}
                            />
                            <div className='char-counter'>{jobDescription.length} / 5000 chars</div>
                        </div>

                        {/* Vertical Divider */}
                        <div className='panel-divider' />

                        {/* Right Panel - Profile */}
                        <div className='panel panel--right'>
                            <div className='panel__header'>
                                <span className='panel__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                </span>
                                <h2>Your Profile</h2>
                            </div>

                            {/* Upload Resume */}
                            <div className='upload-section'>
                                <label className='section-label'>
                                    Upload Resume
                                    <span className='badge badge--best'>Best Results</span>
                                </label>
                                
                                <label className={`dropzone ${selectedFile ? 'dropzone--has-file' : ''}`} htmlFor='resume'>
                                    {selectedFile ? (
                                        <div className='file-selected-box'>
                                            <div className='file-icon'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                                            </div>
                                            <div className='file-details'>
                                                <p className='file-name'>{selectedFile.name}</p>
                                                <p className='file-size'>{formatFileSize(selectedFile.size)}</p>
                                            </div>
                                            <button type='button' className='remove-file-btn' onClick={removeFile} title='Remove file'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className='dropzone__icon'>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></svg>
                                            </span>
                                            <p className='dropzone__title'>Click to upload or drag &amp; drop</p>
                                            <p className='dropzone__subtitle'>PDF or DOCX (Max 5MB)</p>
                                        </>
                                    )}
                                    <input 
                                        ref={resumeInputRef} 
                                        onChange={handleFileChange} 
                                        hidden 
                                        type='file' 
                                        id='resume' 
                                        name='resume' 
                                        accept='.pdf,.docx' 
                                    />
                                </label>
                            </div>

                            {/* OR Divider */}
                            <div className='or-divider'><span>OR</span></div>

                            {/* Quick Self-Description */}
                            <div className='self-description'>
                                <label className='section-label' htmlFor='selfDescription'>Quick Self-Description</label>
                                <textarea
                                    value={selfDescription}
                                    onChange={(e) => { 
                                        setSelfDescription(e.target.value) 
                                        if (validationError) setValidationError("")
                                    }}
                                    id='selfDescription'
                                    name='selfDescription'
                                    className='panel__textarea panel__textarea--short'
                                    placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                                />
                            </div>

                            {/* Info Box */}
                            <div className='info-box'>
                                <span className='info-box__icon'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" stroke="#1a1f27" strokeWidth="2" /><line x1="12" y1="16" x2="12.01" y2="16" stroke="#1a1f27" strokeWidth="2" /></svg>
                                </span>
                                <p>Either a <strong>Resume</strong> or a <strong>Self Description</strong> is required to personalize your strategy.</p>
                            </div>
                        </div>
                    </div>

                    {/* Card Footer */}
                    <div className='interview-card__footer'>
                        <span className='footer-info'>AI-Powered Strategy Generation &bull; Approx 15-30s</span>
                        <button
                            type="button"
                            onClick={handleGenerateReport}
                            disabled={generating}
                            className='generate-btn'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" /></svg>
                            Generate My Interview Strategy
                        </button>
                    </div>
                </div>

                {/* Recent Reports List with Non-Blocking Loading */}
                <section className='recent-reports'>
                    <h2>My Recent Interview Plans</h2>
                    {!user ? (
                        <div className='guest-cta-card'>
                            <div className='guest-cta-badge'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                </svg>
                            </div>
                            <div className='guest-cta-content'>
                                <h3>Save &amp; Track Your Interview Strategy History</h3>
                                <p>Sign in to save generated mock questions, track candidate match scores, and access your 7-day preparation roadmaps anytime.</p>
                            </div>
                            <div className='guest-cta-actions'>
                                <button type="button" className='guest-btn guest-btn--primary' onClick={() => navigate('/login')}>
                                    Sign In
                                </button>
                                <button type="button" className='guest-btn guest-btn--secondary' onClick={() => navigate('/register')}>
                                    Create Account
                                </button>
                            </div>
                        </div>
                    ) : reportsLoading ? (
                        <RecentReportsSkeleton />
                    ) : reports.length > 0 ? (

                        <ul className='reports-list'>
                            {reports.map(report => (
                                <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                    <div className='report-item-header'>
                                        <h3>{report.title || 'Untitled Position'}</h3>
                                        <span className={`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>
                                            {report.matchScore}% Match
                                        </span>
                                    </div>
                                    <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className='no-reports-msg'>No previous interview plans found. Create your first plan above!</p>
                    )}
                </section>


                {/* Page Footer */}
                <footer className='page-footer'>
                    <a href='#'>Privacy Policy</a>
                    <a href='#'>Terms of Service</a>
                    <a href='#'>Help Center</a>
                </footer>
            </main>
        </div>
    )
}

export default Home