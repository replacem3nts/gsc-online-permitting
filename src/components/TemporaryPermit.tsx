interface TemporaryPermitProps {
  userData: {
    firstName: string;
    lastName: string;
    height: string;
    dateOfBirthMonth: number;
    dateOfBirthDay: number;
    dateOfBirthYear: number;
    eyeColor: string;
    permitNumber?: string;
    paymentDate?: string;
    tempPermitExpirationDate?: string;
  } | null;
  userId: string | null;
  amount: string | null;
  getExpirationDate: () => string;
  formatDateOfBirth: () => string;
}

export default function TemporaryPermit({ 
  userData, 
  userId, 
  amount, 
  getExpirationDate, 
  formatDateOfBirth 
}: TemporaryPermitProps) {
  return (
    <div 
      id="temporary-permit"
      className="border-4 border-black p-6 bg-white relative"
      style={{ 
        fontFamily: 'Arial, sans-serif',
        width: '8.5in',
        minHeight: 'fit-content'
      }}
    >
      {/* Center Divider - Dotted line full height of permit */}
      <div className="absolute left-1/2 top-0 bottom-0 w-px border-l-2 border-dotted border-black transform -translate-x-1/2 z-10"></div>

      {/* Foldable Layout - Two Halves */}
      <div className="flex h-full relative">
        {/* LEFT HALF - Front of permit when folded */}
        <div className="w-1/2 pr-6">
          {/* Header for left half */}
          <div className="text-center mb-4">
            <div className="text-2xl font-bold mb-1">TOWN OF GREENWICH</div>
            <div className="text-lg font-bold mt-2 mb-3">TEMPORARY SHELLFISH PERMIT</div>
            <div className="text-xs mb-4 text-center px-8 leading-relaxed">This is a temporary permit for recreational shellfishing. It is valid for 14 days from the date of issuance.</div>
            
            {/* 4-Quadrant Box */}
            <div className="grid grid-cols-2 gap-4 border-2 border-white overflow-hidden">
              <div className="border-r-2 border-b-2 border-white p-1.5 text-left bg-gray-50" style={{ border: '1px solid black' }}>
                <div className="text-xs text-gray-700 mb-0.5 font-bold uppercase tracking-wide">Season</div>
                <div className="text-base font-bold pl-2">'25 - '26</div>
              </div>
              <div className="border-b-2 border-white p-1.5 text-left bg-gray-50" style={{ border: '1px solid black' }}>
                <div className="text-xs text-gray-700 mb-0.5 font-bold uppercase tracking-wide">Permit</div>
                <div className="text-base font-bold pl-2">{userData?.permitNumber || '001'}</div>
              </div>
              <div className="border-r-2 border-white p-1.5 text-left bg-gray-50" style={{ border: '1px solid black' }}>
                <div className="text-xs text-gray-700 mb-0.5 font-bold uppercase tracking-wide">Issued</div>
                <div className="text-base font-bold pl-2">{userData?.paymentDate}</div>
              </div>
              <div className="p-1.5 text-left bg-gray-50" style={{ border: '1px solid black' }}>
                <div className="text-xs text-gray-700 mb-0.5 font-bold uppercase tracking-wide">Expires</div>
                <div className="text-base font-bold pl-2">{userData?.tempPermitExpirationDate}</div>
              </div>
            </div>
          </div>

          {/* Legal Text */}
          <div className="text-left text-xs border-t-2 border-black pt-3 mt-4">
            <div className="leading-relaxed">
              Issued under Sections 26-257a and 26-291a of the Connecticut General Statutes, this permit authorizes the holder to collect shellfish within Greenwich waters in accordance with Greenwich Shellfish Commission regulations.
            </div>
          </div>
        </div>

        {/* RIGHT HALF - Back of permit when folded */}
        <div className="w-1/2 pl-6">
          {/* Permit Holder */}
          <div className="text-center mb-6">
            <div className="text-lg font-bold mb-4">PERMIT HOLDER</div>
          </div>

          {/* Permit Holder Info - Name on top, 3 fields below */}
          <div className="mb-6">
            {/* Name spanning full width */}
            <div className="border-2 border-white p-1.5 text-left bg-gray-50 mb-4" style={{ border: '1px solid black' }}>
              <div className="text-xs text-gray-700 mb-0.5 font-bold uppercase tracking-wide">Name</div>
              <div className="text-base font-bold pl-2">{`${userData?.firstName} ${userData?.lastName}`}</div>
            </div>
            
            {/* Three fields in a row */}
            <div className="grid grid-cols-3 gap-4 border-2 border-white overflow-hidden">
              <div className="border-r-2 border-white p-1.5 text-left bg-gray-50" style={{ border: '1px solid black' }}>
                <div className="text-xs text-gray-700 mb-0.5 font-bold uppercase tracking-wide">Height</div>
                <div className="text-base font-bold pl-2">{userData?.height}</div>
              </div>
              <div className="border-r-2 border-white p-1.5 text-left bg-gray-50" style={{ border: '1px solid black' }}>
                <div className="text-xs text-gray-700 mb-0.5 font-bold uppercase tracking-wide">D.O.B.</div>
                <div className="text-base font-bold pl-2">{formatDateOfBirth()}</div>
              </div>
              <div className="p-1.5 text-left bg-gray-50" style={{ border: '1px solid black' }}>
                <div className="text-xs text-gray-700 mb-0.5 font-bold uppercase tracking-wide">Eye Color</div>
                <div className="text-base font-bold pl-2">{userData?.eyeColor}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Signature Lines */}
            <div className="text-sm">
              <div className="flex justify-between items-end mb-2">
                <div className="flex-1 pr-4">
                  <div className="border-b-2 border-black h-8"></div>
                  <div className="text-xs mt-1 text-left">Signature</div>
                </div>
                <div className="w-20 pl-4">
                  <div className="border-b-2 border-black h-8"></div>
                  <div className="text-xs mt-1 text-left">Date</div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="text-left text-xs italic bg-gray-50 p-3 rounded">
              <div>This Permit Holder agrees that the Town of Greenwich is not liable for any injury or damage he or she incurs while shellfishing in Town waters.</div>
            </div>

          </div>
        </div>
      </div>

      {/* Footer - Two separate boxes with full borders */}
      <div className="flex mt-6">
        {/* Left side footer box */}
        <div className="w-1/2 pr-6">
          <div className="border-2 border-black pt-4 pb-4">
            <div className="text-center text-sm">
              <div className="font-bold mb-1">GREENWICH SHELLFISH COMMISSION</div>
              <div className="font-bold">(203) 622-7777</div>
            </div>
          </div>
        </div>
        
        {/* Right side footer box */}
        <div className="w-1/2 pl-6">
          <div className="border-2 border-black pt-4 pb-4">
            <div className="text-center text-sm">
              <div className="font-bold mb-1">GREENWICH SHELLFISH COMMISSION</div>
              <div className="font-bold">(203) 622-7777</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
