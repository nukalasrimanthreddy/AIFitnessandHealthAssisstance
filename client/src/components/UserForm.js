"use client";
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../contexts/UserContext';
import { BiSolidSend } from "react-icons/bi";
import WeeklyPlan from "./WeeklyPlan";
import toast from "react-hot-toast";
import '../pages/MealPlan.css'
import { generateWorkOutPlan, getWorkoutPlans, deleteWorkoutPlan } from '../utils/api';

export default function UserForm({ setData, setLoading, loading }) {
	const { user, loading: contextLoading } = useContext(UserContext);
	const [error, setError] = useState('');
	const [workoutPlans, setWorkoutPlans] = useState([]);
	const [activePlan, setActivePlan] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		if (!contextLoading && !user) {
			navigate('/login');
			return;
		}

		if (user) {
			fetchWorkoutPlans();
		}
	}, [user, contextLoading, workoutPlans.length, navigate]);

	const fetchWorkoutPlans = async () => {
		setLoading(true);
		try {
			const plans = await getWorkoutPlans(user._id);
			setWorkoutPlans(plans);
			if (plans.length > 0) {
				setActivePlan(plans[0]._id);
			}
		} catch (error) {
			console.error('Error fetching workout plans:', error);
			setError('Failed to load workout plans. Please try again.');
		} finally {
			setLoading(false);
		}
	};

	const getActiveWorkoutPlan = () => {
		return workoutPlans.find((plan) => plan._id === activePlan);
	};

	// Optional: implement this to allow deleting plans
	const handleDeleteWorkoutPlan = async (planId) => {
		if (window.confirm('Are you sure you want to delete this meal plan?')) {
			try {
			  await deleteWorkoutPlan(planId);
			  setWorkoutPlans(workoutPlans.filter(plan => plan._id !== planId));
			  if (activePlan === planId && workoutPlans.length > 1) {
				const remainingPlans = workoutPlans.filter(plan => plan._id !== planId);
				setActivePlan(remainingPlans[0]._id);
			  }
			} catch (error) {
			  console.error('Error deleting meal plan:', error);
			  setError('Failed to delete meal plan. Please try again.');
			}
		  }
	};

	const [formData, setFormData] = useState({
		height: "",
		weight: "",
		age: "",
		gender: "male",
		fitnessLevel: "beginner",
		goal: "fat_loss",
	});

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
	
		try {
			const result = await generateWorkOutPlan(user._id, formData);
			
			if (result && result._id) {
				toast.success("Workout plan generated!");
			
				setWorkoutPlans(prev => [result, ...prev]);
				setActivePlan(result._id);
			} 
			else {
				toast.error(result?.error?.message || "Something went wrong");
			}
		} catch (err) {
			console.error(err);
			toast.error("Failed to generate workout");
		} finally {
			setLoading(false);
		}
	};
	

	return (
		<div>
			<form onSubmit={handleSubmit} className="container mt-5 p-4 border rounded shadow">
				<div className=''><h1 className="mb-4 fw-bold text-center">Generate a Workout Plan</h1></div>
				<div className="row mb-3">
					<div className="col-md-4">
						<label className="form-label">Height (cm)</label>
						<input type="number" name="height" value={formData.height} onChange={handleChange} className="form-control" required />
					</div>
					<div className="col-md-4">
						<label className="form-label">Weight (kg)</label>
						<input type="number" name="weight" value={formData.weight} onChange={handleChange} className="form-control" required />
					</div>
					<div className="col-md-4">
						<label className="form-label">Age (yrs)</label>
						<input type="number" name="age" value={formData.age} onChange={handleChange} className="form-control" required />
					</div>
				</div>

				<div className="row mb-3">
					<div className="col-md-4">
						<label className="form-label">Gender</label>
						<select name="gender" value={formData.gender} onChange={handleChange} className="form-select">
							<option value="male">Male</option>
							<option value="female">Female</option>
						</select>
					</div>
					<div className="col-md-4">
						<label className="form-label">Fitness Level</label>
						<select name="fitnessLevel" value={formData.fitnessLevel} onChange={handleChange} className="form-select">
							<option value="beginner">Beginner</option>
							<option value="intermediate">Intermediate</option>
							<option value="advanced">Advanced</option>
						</select>
					</div>
					<div className="col-md-4">
						<label className="form-label">Goal</label>
						<select name="goal" value={formData.goal} onChange={handleChange} className="form-select">
							<option value="fat_loss">Weight Loss</option>
							<option value="muscle_gain">Muscle Gain</option>
							<option value="overall_fitness">Overall Fitness</option>
							<option value="stress_reduction">Stress Reduction</option>
						</select>
					</div>
				</div>

				<div className="d-flex justify-content-end">
					<button type="submit" disabled={loading} className="btn btn-primary d-flex align-items-center gap-2">
						{loading ? "Please wait..." : <>Submit <BiSolidSend /></>}
					</button>
				</div>
			</form>

			{error && <div className="text-danger mt-3">{error}</div>}

			{loading ? (
				<div className="loading-container text-center my-4">
					<div className="spinner-border" role="status"></div>
				</div>
			) : workoutPlans.length === 0 ? (
				<div className="empty-state text-center mt-5">
					<p className="fs-5">You don't have any workout plans yet.</p>
					<p>Click the button above to generate your first workout plan!</p>
				</div>
			) : (
				<div className="mt-5">
					{/* Plan selector */}
					<div className="d-flex flex-wrap gap-2 mb-4">
						{workoutPlans.map((plan, index) => (
							<button
								key={plan._id}
								className={`btn ${activePlan === plan._id ? 'btn-primary' : 'btn-outline-primary'}`}
								onClick={() => setActivePlan(plan._id)}
							>
								Plan #{index + 1}
							</button>
						))}
					</div>

					{/* Plan viewer */}
					{getActiveWorkoutPlan() && (
						<div className="active-plan">
							<div className="plan-actions">
							<h4>Workout Plan for {new Date(getActiveWorkoutPlan().generatedAt).toLocaleDateString()}</h4>
							<div className="d-flex justify-content-center">
							<button
								className="delete-button"
								onClick={() => handleDeleteWorkoutPlan(getActiveWorkoutPlan()._id)}
							>
								Delete Plan
							</button>
							</div>
							</div>
							<WeeklyPlan data={getActiveWorkoutPlan().week} />
						</div>
					)}
				</div>
			)}
		</div>
	);
}
