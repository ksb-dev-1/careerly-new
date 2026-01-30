// ----------------------------------------
// Imports
// ----------------------------------------
import Link from "next/link";
import Image from "next/image";

// lib
import { Project, SocialLink } from "@/lib/validation";
import { JobSeekerProfileData } from "@/lib/job-seeker/fetch-job-seeker-profile-details";

// components
import { UploadResume } from "@/components/job-seeker/UploadResume";
import { EditLink } from "@/components/EditLink";
import { Markdown } from "@/components/Markdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

// 3rd party
import TurndownService from "turndown";
import {
  User,
  Mail,
  MapPin,
  Layers,
  Edit,
  FileText,
  Bookmark,
  BriefcaseBusiness,
  BriefcaseBusinessIcon,
  ClipboardList,
  Link as LinkIcon,
  Info,
} from "lucide-react";

// ----------------------------------------
// Helper Functions
// ----------------------------------------
function calculateProfileCompletion(details: JobSeekerProfileData) {
  const fields = [
    { key: "name", label: "Name", value: details.name },
    { key: "email", label: "Email", value: details.email },
    {
      key: "profileImage",
      label: "Profile Image",
      value: details.profileImage,
    },
    { key: "experience", label: "Experience", value: details.experience },
    { key: "skills", label: "Skills", value: details.skills },
    { key: "projects", label: "Projects", value: details.projects },
    { key: "socials", label: "Social Links", value: details.socials },
    { key: "resume", label: "Resume", value: details.resume },
    { key: "location", label: "Location", value: details.location },
    { key: "about", label: "About", value: details.about },
  ];

  const filledFields = fields.filter(
    (field) =>
      field.value !== undefined &&
      field.value !== null &&
      field.value.toString().trim() !== "",
  );

  const missingFields = fields.filter(
    (field) =>
      field.value === undefined ||
      field.value === null ||
      field.value.toString().trim() === "",
  );

  const completion = Math.round((filledFields.length / fields.length) * 100);

  return {
    completion,
    missingFields: missingFields.map((f) => f.label),
  };
}

// ----------------------------------------
// User Details Component
// ----------------------------------------
interface UserDetailsProps {
  name: string | null | undefined;
  email: string;
  profileImage: string | null | undefined;
}

function UserDetails({ name, email, profileImage }: UserDetailsProps) {
  return (
    <Card className="relative w-full p-6 flex flex-col items-center md:items-start">
      {profileImage ? (
        <div className="relative w-20 h-20 rounded-full border shadow-sm overflow-hidden">
          <Image
            src={profileImage}
            alt={name || "Profile"}
            fill
            className="object-cover"
            sizes="(max-width: 80px) 100vw, 80px"
            priority
          />
        </div>
      ) : (
        <div className="relative w-20 h-20 rounded-full border flex items-center justify-center shadow-sm">
          <User size={48} className="text-brand" />
        </div>
      )}

      <div>
        <CardTitle className="text-center md:text-start capitalize font-bold">
          {name || "Anonymous User"}
        </CardTitle>
        <p className="flex items-center gap-2 mt-2 text-muted-foreground text-center md:text-start">
          <Mail className="w-4 h-4" />
          <span className="text-sm">{email}</span>
        </p>
      </div>

      <EditLink
        href={`/job-seeker/profile/edit`}
        className="absolute top-4 right-4"
      />
    </Card>
  );
}

// ----------------------------------------
// Profile Progress Component
// ----------------------------------------
interface ProfileProgressProps {
  completion: number;
  missingFields: string[];
}

function ProfileProgress({ completion, missingFields }: ProfileProgressProps) {
  return (
    <Card className="relative w-full space-y-0 gap-0">
      <CardHeader>
        <CardTitle className="font-bold">Profile Progress</CardTitle>
        <CardDescription>
          A stronger profile increases your chances of getting hired.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex justify-between items-center mb-1">
          <span />
          <span className="font-semibold">{completion}%</span>
        </div>

        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              completion === 100
                ? "bg-green-600"
                : completion > 70
                  ? "bg-orange-500"
                  : completion > 30
                    ? "bg-yellow-500"
                    : "bg-red-500"
            }`}
            style={{ width: `${completion}%` }}
          />
        </div>

        <div className={`${completion !== 100 ? "mt-4" : ""}`}>
          {completion === 100 ? (
            <p className="text-xs text-brand mt-2">
              Your profile is complete and visible to candidates
            </p>
          ) : (
            <div>
              <p className="text-sm font-semibold">
                Provide follwing fields to complete your profile
              </p>

              <div className="flex items-center flex-wrap gap-2 mt-4">
                {missingFields.map((field) => (
                  <Badge
                    key={field}
                    variant="outline"
                    className="text-muted-foreground"
                  >
                    {field}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------
// More about Job Seeker Component
// ----------------------------------------
interface MoreAboutJobSeekerProps {
  experience: string;
  skills: string[];
  projects: Project[];
  socials: SocialLink[];
  location: string | null | undefined;
  about: string;
}

function MoreAboutJobSeeker({
  experience,
  skills,
  projects,
  socials,
  location,
  about,
}: MoreAboutJobSeekerProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-bold">Details</CardTitle>
        <CardDescription>
          More details about employer or company
        </CardDescription>
      </CardHeader>

      <Separator />

      <CardContent>
        <div className="space-y-6">
          {/* Top details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Skills */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Layers className="w-4 h-4 text-brand" />
                <span>Skills</span>
              </div>

              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <Badge variant="outline" key={skill}>
                      {skill}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Not provided</p>
              )}
            </div>

            {/* Experience */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <BriefcaseBusinessIcon className="w-4 h-4 text-brand" />
                <span>Experience</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {experience ? `${experience} years` : "Not provided"}
              </p>
            </div>

            {/* Location */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <MapPin className="w-4 h-4 text-brand" />
                <span>Location</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {location || "Not specified"}
              </p>
            </div>
          </div>

          <Separator />

          {/* Projects */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <ClipboardList className="w-4 h-4 text-brand" />
              <span>Projects</span>
            </div>

            {projects.length > 0 ? (
              <ul className="space-y-1 text-sm">
                {projects.map((project) => (
                  <li key={project.link}>
                    <a
                      href={project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:underline"
                    >
                      {project.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Not provided</p>
            )}
          </div>

          {/* Social links */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <LinkIcon className="w-4 h-4 text-brand" />
              <span>Social Profiles</span>
            </div>

            {socials.length > 0 ? (
              <ul className="space-y-1 text-sm">
                {socials.map((social) => (
                  <li key={social.url}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand hover:underline"
                    >
                      {social.platform}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Not provided</p>
            )}
          </div>

          <Separator />

          {/* About */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Info className="w-4 h-4 text-brand" />
              <span>About</span>
            </div>

            {about ? (
              <Markdown>{about}</Markdown>
            ) : (
              <p className="text-sm text-muted-foreground">Not provided</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------
// Quick Links Component
// ----------------------------------------
function QuickLinks() {
  return (
    <Card className="w-full gap-0!">
      <CardHeader>
        <CardTitle className="font-bold">Quick Links</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3 mt-4">
        <Link
          href="/job-seeker/jobs"
          className="flex items-center text-brand gap-2 text-sm rounded-md font-medium hover:underline w-fit transition-all"
          prefetch={true}
        >
          <BriefcaseBusiness className="w-4 h-4" />
          Jobs
        </Link>

        <Link
          href="/job-seeker/bookmarks"
          className="flex items-center text-brand gap-2 text-sm rounded-md font-medium hover:underline w-fit transition-all"
          prefetch={true}
        >
          <Bookmark className="w-4 h-4" />
          Bookmarks
        </Link>

        <Link
          href="/job-seeker/applications"
          className="flex items-center text-brand gap-2 text-sm rounded-md font-medium hover:underline w-fit transition-all"
          prefetch={true}
        >
          <FileText className="w-4 h-4" />
          Applications
        </Link>

        <Link
          href="/job-seeker/profile/edit"
          className="flex items-center text-brand gap-2 text-sm rounded-md font-medium hover:underline w-fit transition-all"
          prefetch={true}
        >
          <Edit className="w-4 h-4" />
          Edit Profile
        </Link>
      </CardContent>
    </Card>
  );
}

// ----------------------------------------
// Main Component
// ----------------------------------------
interface JobSeekerProfileProps {
  details: JobSeekerProfileData;
}

export function JobSeekerProfile({ details }: JobSeekerProfileProps) {
  const turndown = new TurndownService();

  const {
    name,
    email,
    profileImage,
    experience,
    skills,
    projects,
    socials,
    location,
    about,
  } = details;

  const markdown = turndown.turndown(about ? about : "");
  const { completion, missingFields } = calculateProfileCompletion(details);

  return (
    <div className="min-h-screen max-w-custom w-full pt-32 pb-16 mx-auto px-4">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-full md:w-120 space-y-6">
          {/* User Details */}
          <UserDetails name={name} email={email} profileImage={profileImage} />

          {/* Quick Links */}
          <div className="hidden md:flex">
            <QuickLinks />
          </div>

          {/* Profile Progress */}
          <div className="flex md:hidden">
            <ProfileProgress
              completion={completion}
              missingFields={missingFields}
            />
          </div>
        </div>
        <div className="w-full space-y-6">
          {/* Profile Progress */}
          <div className="hidden md:flex">
            <ProfileProgress
              completion={completion}
              missingFields={missingFields}
            />
          </div>

          <UploadResume resume={details.resume} />

          {/* Employer or Company Details */}
          <MoreAboutJobSeeker
            experience={experience}
            skills={skills}
            projects={projects}
            socials={socials}
            location={location}
            about={markdown}
          />

          {/* Quick Links */}
          <div className="flex md:hidden">
            <QuickLinks />
          </div>
        </div>
      </div>
    </div>
  );
}
