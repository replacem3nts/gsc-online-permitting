interface ShellfishPermitProps {
    season?: string;
    permitNumber?: string;
    issued?: string;
    expires?: string;
    name?: string;
    height?: string;
    dob?: string;
    eyeColor?: string;
    signature?: string;
    date?: string;
  }
  
  export function ShellfishPermit({
    season = '25 - \'26',
    permitNumber = "008",
    issued = "10/24/25",
    expires = "10/24/26",
    name = "hi hi",
    height = '6\'6"',
    dob = "6/6/1966",
    eyeColor = "Brown",
    signature = "",
    date = ""
  }: ShellfishPermitProps) {
    return (
      <svg
        viewBox="0 0 800 500"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        style={{ border: '4px solid black', backgroundColor: 'white' }}
      >
        {/* Background and Border */}
        <rect x="0" y="0" width="800" height="500" fill="white" stroke="black" strokeWidth="4" />

        {/* Header */}
        <text x="200" y="45" textAnchor="middle" style={{ fontSize: '24px', fontWeight: 'bold' }} fill="black">
          TOWN OF GREENWICH
        </text>
        <text x="200" y="75" textAnchor="middle" style={{ fontSize: '18px', fontWeight: 'bold' }} fill="black">
          TEMPORARY SHELLFISH PERMIT
        </text>
        <text x="200" y="105" textAnchor="middle" style={{ fontSize: '11px' }} fill="black">
          This is a temporary permit for recreational shellfishing.
        </text>
        <text x="200" y="120" textAnchor="middle" style={{ fontSize: '11px' }} fill="black">
          It is valid for 14 days from the date of issuance.
        </text>

        {/* Quadrant 1: Season */}
        <rect x="30" y="140" width="150" height="60" fill="#f9fafb" stroke="black" strokeWidth="1" />
        <text x="35" y="165" style={{ fontSize: '10px', fontWeight: 'bold' }} fill="black">SEASON</text>
        <text x="110" y="190" textAnchor="middle" style={{ fontSize: '18px' }} fill="black">{season}</text>

        {/* Quadrant 2: Permit */}
        <rect x="200" y="140" width="150" height="60" fill="#f9fafb" stroke="black" strokeWidth="1" />
        <text x="215" y="165" style={{ fontSize: '10px', fontWeight: 'bold' }} fill="black">PERMIT</text>
        <text x="290" y="190" textAnchor="middle" style={{ fontSize: '18px' }} fill="black">{permitNumber}</text>

        {/* Quadrant 3: Issued */}
        <rect x="30" y="220" width="150" height="60" fill="#f9fafb" stroke="black" strokeWidth="1" />
        <text x="35" y="245" style={{ fontSize: '10px', fontWeight: 'bold' }} fill="black">ISSUED</text>
        <text x="110" y="265" textAnchor="middle" style={{ fontSize: '16px' }} fill="black">{issued}</text>

        {/* Quadrant 4: Expires */}
        <rect x="200" y="220" width="150" height="60" fill="#f9fafb" stroke="black" strokeWidth="1" />
        <text x="215" y="245" style={{ fontSize: '10px', fontWeight: 'bold' }} fill="black">EXPIRES</text>
        <text x="290" y="265" textAnchor="middle" style={{ fontSize: '16px' }} fill="black">{expires}</text>

        {/* Legal Text */}
        <text x="30" y="320" style={{ fontSize: '9px' }} fill="black">
          Issued under Sections 26-257a and 26-291a of the Connecticut General Statutes,
        </text>
        <text x="30" y="333" style={{ fontSize: '9px' }} fill="black">
          this permit authorizes the holder to collect shellfish within Greenwich waters
        </text>
        <text x="30" y="346" style={{ fontSize: '9px' }} fill="black">
          in accordance with Greenwich Shellfish Commission regulations.
        </text>
        <text x="30" y="359" style={{ fontSize: '9px' }} fill="black">
          This Permit Holder agrees that the Town of Greenwich is not liable for any injury or damage
        </text>

        {/* Footer */}
        <text x="200" y="435" textAnchor="middle" style={{ fontSize: '16px', fontWeight: 'bold' }} fill="black">
          GREENWICH SHELLFISH COMMISSION
        </text>
        <text x="200" y="455" textAnchor="middle" style={{ fontSize: '14px' }} fill="black">
          (203) 622-7777
        </text>

        {/* Right Side - Permit Holder Info */}
        <text x="600" y="45" textAnchor="middle" style={{ fontSize: '20px', fontWeight: 'bold' }} fill="black">
          PERMIT HOLDER
        </text>

        {/* Name */}
        <rect x="430" y="60" width="320" height="60" fill="#f9fafb" stroke="black" strokeWidth="1" />
        <text x="437" y="88" style={{ fontSize: '10px', fontWeight: 'bold' }} fill="black">NAME</text>
        <text x="437" y="110" style={{ fontSize: '16px' }} fill="black">{name}</text>

        {/* Height */}
        <rect x="430" y="130" width="100" height="60" fill="#f9fafb" stroke="black" strokeWidth="1" />
        <text x="437" y="158" style={{ fontSize: '10px', fontWeight: 'bold' }} fill="black">HEIGHT</text>
        <text x="485" y="180" textAnchor="middle" style={{ fontSize: '16px' }} fill="black">{height}</text>

        {/* D.O.B. */}
        <rect x="540" y="130" width="100" height="60" fill="#f9fafb" stroke="black" strokeWidth="1" />
        <text x="558" y="158" style={{ fontSize: '10px', fontWeight: 'bold' }} fill="black">D.O.B.</text>
        <text x="607" y="180" textAnchor="middle" style={{ fontSize: '14px' }} fill="black">{dob}</text>

        {/* Eye Color */}
        <rect x="650" y="130" width="100" height="60" fill="#f9fafb" stroke="black" strokeWidth="1" />
        <text x="681" y="158" style={{ fontSize: '10px', fontWeight: 'bold' }} fill="black">EYE COLOR</text>
        <text x="728" y="180" textAnchor="middle" style={{ fontSize: '16px' }} fill="black">{eyeColor}</text>

        {/* Signature */}
        <text x="432" y="265" style={{ fontSize: '10px' }} fill="black">Signature</text>
        {signature && (
          <text x="550" y="245" style={{ fontSize: '14px', fontStyle: 'italic' }} fill="black">{signature}</text>
        )}

        {/* Date */}
        <text x="725" y="265" style={{ fontSize: '10px' }} fill="black">Date</text>
        {date && (
          <text x="752" y="245" style={{ fontSize: '12px' }} fill="black">{date}</text>
        )}

        {/* Disclaimer */}
        <text x="432" y="300" style={{ fontSize: '9px', fontStyle: 'italic' }} fill="black">
          This Permit Holder agrees that the Town of Greenwich is not liable for any injury or damage
        </text>
        <text x="432" y="313" style={{ fontSize: '9px', fontStyle: 'italic' }} fill="black">
          he or she incurs while shellfishing in Town waters.
        </text>
        <text x="432" y="326" style={{ fontSize: '9px', fontStyle: 'italic' }} fill="black">
          This permit is valid for recreational shellfishing only.
        </text>

        {/* Additional Footer */}
        <text x="606" y="435" textAnchor="middle" style={{ fontSize: '16px', fontWeight: 'bold' }} fill="black">
          GREENWICH SHELLFISH COMMISSION
        </text>
        <text x="606" y="455" textAnchor="middle" style={{ fontSize: '14px' }} fill="black">
          (203) 622-7777
        </text>
      </svg>
    );
  }
