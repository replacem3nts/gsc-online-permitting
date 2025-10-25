import { ImageResponse } from '@vercel/og';

export function generatePermitImage(userData: any) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '816px',
          height: '600px',
          background: 'white',
          display: 'flex',
          flexDirection: 'column',
          fontFamily: 'system-ui, sans-serif',
          border: '2px solid #000',
          position: 'relative',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px',
            borderBottom: '2px solid #000',
            backgroundColor: '#f8f9fa',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img
              src="https://gsc-online-permitting.vercel.app/greenwich_logo.png"
              alt="Greenwich Logo"
              style={{ height: '60px', marginRight: '20px' }}
            />
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold' }}>TOWN OF GREENWICH</div>
              <div style={{ fontSize: '18px' }}>SHELLFISH PERMIT</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '16px', fontWeight: 'bold' }}>PERMIT #{userData.permitNumber || '001'}</div>
            <div style={{ fontSize: '14px' }}>ISSUED: {userData.paymentDate ? new Date(userData.paymentDate).toLocaleDateString() : new Date().toLocaleDateString()}</div>
            <div style={{ fontSize: '14px' }}>EXPIRES: {userData.tempPermitExpirationDate ? new Date(userData.tempPermitExpirationDate).toLocaleDateString() : (() => {
              const expirationDate = new Date();
              expirationDate.setDate(expirationDate.getDate() + 14);
              return expirationDate.toLocaleDateString();
            })()}</div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ padding: '20px', flex: 1 }}>
          {/* Left Side - Quadrants */}
          <div style={{ display: 'flex', marginBottom: '20px' }}>
            <div style={{ flex: 1, marginRight: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', height: '200px' }}>
                <div style={{ border: '1px solid #000', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>PERMIT HOLDER</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }}>{userData.firstName} {userData.lastName}</div>
                </div>
                <div style={{ border: '1px solid #000', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>PERMIT TYPE</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }}>{userData.permitType || 'REGULAR'}</div>
                </div>
                <div style={{ border: '1px solid #000', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>D.O.B.</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }}>{userData.dateOfBirth || 'N/A'}</div>
                </div>
                <div style={{ border: '1px solid #000', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>ADDRESS</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>{userData.address || 'N/A'}</div>
                </div>
              </div>
            </div>
            
            {/* Right Side - Permit Holder Info */}
            <div style={{ flex: 1, marginLeft: '10px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', height: '200px' }}>
                <div style={{ border: '1px solid #000', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>PHONE</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }}>{userData.phoneNumber || 'N/A'}</div>
                </div>
                <div style={{ border: '1px solid #000', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>EMAIL</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>{userData.email || 'N/A'}</div>
                </div>
                <div style={{ border: '1px solid #000', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>EMERGENCY CONTACT</div>
                  <div style={{ fontSize: '14px', fontWeight: 'bold', textAlign: 'center' }}>{userData.emergencyContact || 'N/A'}</div>
                </div>
                <div style={{ border: '1px solid #000', padding: '10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ fontSize: '12px', fontWeight: 'bold' }}>EMERGENCY PHONE</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', textAlign: 'center' }}>{userData.emergencyPhone || 'N/A'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms and Conditions */}
          <div style={{ marginTop: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', marginBottom: '10px', fontWeight: 'bold' }}>
              This is a temporary permit
            </div>
            <div style={{ fontSize: '12px', lineHeight: '1.4' }}>
              Issued under Sections 26-257a and 26-257b of the Greenwich Code of Ordinances. 
              This permit must be carried while shellfishing and is subject to all applicable 
              regulations and restrictions.
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            borderTop: '2px solid #000',
            padding: '15px 20px',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ fontSize: '12px' }}>
            <div style={{ fontWeight: 'bold' }}>SIGNATURE</div>
            <div style={{ marginTop: '20px', borderBottom: '1px solid #000', width: '200px' }}></div>
          </div>
          <div style={{ fontSize: '12px', textAlign: 'right' }}>
            <div>Greenwich Shellfish Commission</div>
            <div>Date: _______________</div>
          </div>
        </div>
      </div>
    ),
    {
      width: 816,
      height: 600,
    }
  );
}
