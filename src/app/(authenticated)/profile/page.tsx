export default function Profile() {
    return (
        <div className="min-h-screen flex justify-center items-center flex-col gap-2">
            <h1>Profile</h1>
            <p>This is a protected page, only authenticated users can access it.</p>
        </div>
    )
}