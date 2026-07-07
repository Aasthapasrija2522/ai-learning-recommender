import Welcome from '../components/Welcome';
import SignupForm from '../components/SignupForm';

function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <Welcome name="Learner" />
      <SignupForm />
    </div>
  );
}

export default SignupPage;