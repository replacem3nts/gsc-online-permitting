import PermitApplicationForm from '@/components/PermitApplicationForm'

export default function Home() {
  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'rgb(85, 85, 85)', fontFamily: 'EB Garamond, serif' }}>
            Buy a Shellfish Permit
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto text-left" style={{ color: 'rgb(85, 85, 85)' }}>
            To purchase a recreational shellfishing permit, please complete the form below. You will be asked for payment on the following page.
          </p>
        </div>

        {/* Application Form */}
        <div className="max-w-4xl mx-auto">
          <PermitApplicationForm />
        </div>

      </div>
    </div>
  )
}
