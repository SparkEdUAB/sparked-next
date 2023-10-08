"use client";

import BibliophileSvg from "@components/svgs/assets/undraw_bibliophile_re_xarc.svg";
import UniversitySvg from "@components/svgs/assets/undraw_educator_re_ju47.svg";
import EducationSvg from "@components/svgs/assets/undraw_education_f8ru.svg";
import Image from "next/image";

export const CourseBasedSvgImage = ({
  width = 100,
  height = 100,
}: {
  width?: number;
  height?: number;
}) => <Image src={BibliophileSvg} width={width} height={height} alt="" />;
export const UniversitySvgImage = () => (
  <Image src={UniversitySvg} width={100} height={100} alt="" />
);
export const EducationSvgImage = () => (
  <Image src={EducationSvg} width={100} height={100} alt="" />
);
