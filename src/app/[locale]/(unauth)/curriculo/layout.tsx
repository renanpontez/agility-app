import CVTemplate from '@/templates/CVTemplate';

export default function Layout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <CVTemplate>
      <div>{props.children}</div>
    </CVTemplate>
  );
};
