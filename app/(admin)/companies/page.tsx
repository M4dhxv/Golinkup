import { PageHeader } from "@/components/shared/page-header";
import { CompanyDirectory } from "@/components/companies/company-directory";
import { companies } from "@/lib/mock";

export default function CompaniesPage() {
  const totalRoles = companies.reduce((s, c) => s + c.openRoleCount, 0);

  return (
    <div>
      <PageHeader
        title="Companies"
        subtitle={`${companies.length} companies employing alumni · ${totalRoles} open roles tracked`}
      />
      <CompanyDirectory companies={companies} />
    </div>
  );
}
