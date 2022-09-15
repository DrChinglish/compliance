import React from 'react';
import classNames from 'classnames';
import { SectionTilesProps } from '../../utils/SectionProps';
import SectionHeader from './partials/SectionHeader';

const propTypes = {
  ...SectionTilesProps.types
}

const defaultProps = {
  ...SectionTilesProps.defaults
}

const Testimonial = ({
  className,
  topOuterDivider,
  bottomOuterDivider,
  topDivider,
  bottomDivider,
  hasBgColor,
  invertColor,
  pushLeft,
  ...props
}) => {

  const outerClasses = classNames(
    'testimonial section',
    topOuterDivider && 'has-top-divider',
    bottomOuterDivider && 'has-bottom-divider',
    hasBgColor && 'has-bg-color',
    invertColor && 'invert-color',
    className
  );

  const innerClasses = classNames(
    'testimonial-inner section-inner',
    topDivider && 'has-top-divider',
    bottomDivider && 'has-bottom-divider'
  );

  const tilesClasses = classNames(
    'tiles-wrap',
    pushLeft && 'push-left'
  );

  const sectionHeader = {
    title: '平台能力',
    // paragraph: '平台系统能够对用户上传的数据进行自动化合规性审查，从文本、表格、图片、视频、音频等不同数据类型的海量数据中高效准确地对个人信息相关的敏感数据进行盘点，可视化展示审计结果并针对不合规数据智能地给出合规意见并集成一键合规处理功能。'
  };

  return (
    <section
      {...props}
      className={outerClasses}
    >
      <div className="container">
        <div className={innerClasses}>
          {/* <SectionHeader data={sectionHeader} className="center-content" /> */}
          <div className={tilesClasses}>

            <div className="tiles-item reveal-from-right" data-reveal-delay="200">
              <div className="tiles-item-inner">
                <div className="testimonial-item-content">
                  <p className="text-sm mb-0">
                  习近平总书记主持召开中央全面深化改革委员会第二十六次会议，审议通过了《关于构建数据基础制度更好发挥数据要素作用的意见》。会议明确指出要建立合规高效的数据要素流通和交易制度，完善数据全流程合规和监管规则体系，建设规范的数据交易市场。这也是党中央对于数据要素合规的最新要求与明确信号。

                      </p>
                </div>
                <div className="testimonial-item-footer text-xs mt-32 mb-0 has-top-divider">
                  <span className="testimonial-item-name text-color-high">党中央对于数据合规最新指示</span>
                  <span className="text-color-low"> / </span>
                  {/* <span className="testimonial-item-link">
                    <a href="/post_list/">开始合规</a>
                  </span> */}
                </div>
              </div>
            </div>

            <div className="tiles-item reveal-from-bottom">
              <div className="tiles-item-inner">
                <div className="testimonial-item-content">
                  <p className="text-sm mb-0">
<<<<<<< HEAD
                    — 文本数据是同样是一种比较常见的数据格式，不同数据格式中直接或间接包含的个人信息、敏感信息、儿童信息、不良信息、公共信息等进行合规认定，其中敏感信息包括一旦泄露或者非法使用，容易导致自然人的人格尊严受到侵害或者人身、财产安全受到危害的个人信息。
=======
                  新出台的《数据安全法》、《个人信息保护法》与《网络安全法》一同形成了数据合规领域的“三架马车”，这标志着数据合规的基本法律架构已初步搭建完成。网络安全法中 “个人信息”被提及21次之多；个人信息保护法中首次对个人信息保护合规审计提出了明确要求，这为下一步各行业数据合规合法处理与流动提供了法律保障。

>>>>>>> 5f89cb6b02656fe8d413a658fc36858fced61fbc
                      </p>
                </div>
                <div className="testimonial-item-footer text-xs mt-32 mb-0 has-top-divider">
                  <span className="testimonial-item-name text-color-high">数据合规法律架构已初步健全</span>
                  <span className="text-color-low"> / </span>
                  {/* <span className="testimonial-item-link">
                    <a href="#0">开始合规</a>
                  </span> */}
                </div>
              </div>
            </div>

            <div className="tiles-item reveal-from-bottom" data-reveal-delay="200">
              <div className="tiles-item-inner">
                <div className="testimonial-item-content">
                  <p className="text-sm mb-0">
<<<<<<< HEAD
                    — 图像数据当图片给人们带来快捷的信息记录和分享方式的同时，海量图片广泛地传播在大众视野下，相应的问题也随之而来。同样图像数据也直接或间接包含个人信息、敏感信息、不良信息、公共信息等，因此对于图片数据中敏感信息脱敏也尤为重要。
=======
                  国际上对于数据安全监管愈发严格。截至2021年9月30日，GDPR执法总数894起，总罚金超过13亿欧元，欧盟所有成员国均有相关执法记录。我国仅2021 年度与数据安全和个人信息保护相关立法活动就达75次。我国网信办7月正式公布对滴滴事件的处罚结果：对滴滴全球股份有限公司处人民币80.26亿元罚款。
>>>>>>> 5f89cb6b02656fe8d413a658fc36858fced61fbc
                      </p>
                </div>
                <div className="testimonial-item-footer text-xs mt-32 mb-0 has-top-divider">
                  <span className="testimonial-item-name text-color-high">监管愈发严格并且处罚力度大</span>
                  <span className="text-color-low"> / </span>
                  {/* <span className="testimonial-item-link">
                    <a href="#0">开始合规</a>
                  </span> */}
                </div>
              </div>
            </div>

            
            {/* <div className="tiles-item reveal-from-left" data-reveal-delay="200">
              <div className="tiles-item-inner">
                <div className="testimonial-item-content">
                  <p className="text-sm mb-0">
                    — Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum cillum dolore eu fugiat.
                      </p>
                </div>
                <div className="testimonial-item-footer text-xs mt-32 mb-0 has-top-divider">
                  <span className="testimonial-item-name text-color-high">音频数据</span>
                  <span className="text-color-low"> / </span>
                  <span className="testimonial-item-link">
                    <a href="#0">开始合规</a>
                  </span>
                </div>
              </div>
            </div> */}

          </div>
        </div>
      </div>
    </section>
  );
}

Testimonial.propTypes = propTypes;
Testimonial.defaultProps = defaultProps;

export default Testimonial;