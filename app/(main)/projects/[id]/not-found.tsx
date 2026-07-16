import Link from 'next/link';

import { Button, H2, Sub } from '@/components/ui';

export default function ProjectNotFound() {
  return (
    <div className="flex flex-col items-start gap-4 py-16">
      <H2>Project not found</H2>
      <Sub>
        This project may have been removed, or the link is incorrect.
      </Sub>
      <Link href="/home">
        <Button variant="primary">Back to Discover</Button>
      </Link>
    </div>
  );
}
