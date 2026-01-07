import CompanyDashboard from "../components/CompanyDashboard/CompanyDashboard";
import FormHistory from "../components/FormHistory/FormHistory";
import { TableDropDown } from "../components/DropDownComplicated/TableDropDown";
import SigningIn from "../components/SigningIn/SigningIn";
import MemberControl from "../components/MemberControl/MemberControl";

function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <div>
        <button>Company</button>
        <button>Representative</button>
      </div>
      <div>
        <CompanyDashboard />
        <FormHistory />
        <TableDropDown csvPath="\csv\CNIA_JOBS.txt" columns={2}/>
        <SigningIn />
        <MemberControl />
      </div>
    </div>
  );
}

export default Dashboard;