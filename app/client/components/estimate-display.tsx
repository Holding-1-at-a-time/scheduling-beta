export default function EstimateDisplay({ estimate, onSchedule }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Estimated Service Details</h2>
      <p>Estimated Cost: ${estimate.cost}</p>
      <p>Estimated Duration: {estimate.duration} hours</p>
      <button 
        onClick={onSchedule}
        className="bg-green-500 text-white p-2 rounded"
      >
        Schedule Appointment
      </button>
    </div>
  )
}